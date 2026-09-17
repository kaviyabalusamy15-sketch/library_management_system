# Library Management System - Project Documentation

## 1. Problem Statement
Manual library record management can be time-consuming and may lead to duplicate or outdated records. This system provides a web-based interface to manage books, members and book loans.

## 2. Objectives
- Implement complete CRUD operations.
- Store records in a relational database.
- Provide REST APIs.
- Validate user input.
- Demonstrate frontend-backend integration.

## 3. Architecture
User -> React Frontend -> REST API -> Django REST Framework -> Django ORM -> SQLite

## 4. Main Entities
### Book
id, title, author, isbn, category, published_year, quantity, available_quantity

### Member
id, name, email, phone, joined_date

### Loan
id, book, member, issue_date, due_date, return_date, status

## 5. CRUD
Books and Members support Create, Read, Update and Delete.
Loans support creating and listing loan records, plus returning a book and deleting records through the REST API.

## 6. Validation
- Required fields in frontend forms.
- Email format validation.
- Phone length/pattern validation.
- Unique ISBN and member email.
- Available quantity cannot exceed total quantity.
- Backend validation for unavailable books.

## 7. Testing
Recommended tests:
1. Add valid book.
2. Add duplicate ISBN.
3. Edit book.
4. Delete book.
5. Add valid member.
6. Add duplicate email.
7. Issue available book.
8. Attempt to issue unavailable book.
9. Return issued book.
10. Test frontend while backend is stopped.

## 8. Future Enhancements
- Login and role-based access.
- Fine calculation.
- Dashboard charts.
- Pagination.
- Advanced search/filtering.
- PostgreSQL deployment.
