from rest_framework import viewsets
from .models import Book, Member, Loan
from .serializers import BookSerializer, MemberSerializer, LoanSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by("-id")
    serializer_class = BookSerializer

class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all().order_by("-id")
    serializer_class = MemberSerializer

class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.select_related("book", "member").all().order_by("-id")
    serializer_class = LoanSerializer
