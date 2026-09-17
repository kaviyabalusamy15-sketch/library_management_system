from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=150)
    isbn = models.CharField(max_length=20, unique=True)
    category = models.CharField(max_length=100)
    published_year = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField(default=1)
    available_quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.title} - {self.author}"

class Member(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    joined_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name

class Loan(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="loans")
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="loans")
    issue_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, default="Issued")

    def __str__(self):
        return f"{self.book.title} - {self.member.name}"
