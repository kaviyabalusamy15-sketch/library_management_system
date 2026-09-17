from rest_framework import serializers
from .models import Book, Member, Loan

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"

    def validate(self, data):
        quantity = data.get("quantity", getattr(self.instance, "quantity", 1))
        available = data.get(
            "available_quantity",
            getattr(self.instance, "available_quantity", quantity)
        )
        if available > quantity:
            raise serializers.ValidationError(
                {"available_quantity": "Available quantity cannot exceed total quantity."}
            )
        return data

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = "__all__"

class LoanSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source="book.title", read_only=True)
    member_name = serializers.CharField(source="member.name", read_only=True)

    class Meta:
        model = Loan
        fields = [
            "id", "book", "book_title", "member", "member_name",
            "issue_date", "due_date", "return_date", "status"
        ]

    def validate(self, data):
        book = data.get("book", getattr(self.instance, "book", None))
        status = data.get("status", getattr(self.instance, "status", "Issued"))

        if self.instance is None and status == "Issued":
            if not book or book.available_quantity < 1:
                raise serializers.ValidationError(
                    {"book": "This book is currently unavailable."}
                )
        return data

    def create(self, validated_data):
        loan = super().create(validated_data)
        if loan.status == "Issued":
            loan.book.available_quantity -= 1
            loan.book.save(update_fields=["available_quantity"])
        return loan

    def update(self, instance, validated_data):
        old_status = instance.status
        new_status = validated_data.get("status", old_status)

        loan = super().update(instance, validated_data)

        if old_status != "Returned" and new_status == "Returned":
            loan.return_date = loan.return_date
            loan.book.available_quantity = min(
                loan.book.quantity, loan.book.available_quantity + 1
            )
            loan.book.save(update_fields=["available_quantity"])
            loan.save(update_fields=["return_date"])

        return loan
