import React, { useEffect, useState } from "react";
import api from "./api";

const emptyBook = {
  title: "", author: "", isbn: "", category: "",
  published_year: "", quantity: 1, available_quantity: 1
};

const emptyMember = { name: "", email: "", phone: "" };

function App() {
  const [tab, setTab] = useState("books");
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [bookForm, setBookForm] = useState(emptyBook);
  const [memberForm, setMemberForm] = useState(emptyMember);
  const [editingBook, setEditingBook] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const loadAll = async () => {
    try {
      const [b, m, l] = await Promise.all([
        api.get("books/"), api.get("members/"), api.get("loans/")
      ]);
      setBooks(b.data);
      setMembers(m.data);
      setLoans(l.data);
    } catch {
      setMessage("Backend is not running. Start Django server.");
    }
  };

  useEffect(() => { loadAll(); }, []);

  const notify = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  };

  const saveBook = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...bookForm,
        published_year: Number(bookForm.published_year),
        quantity: Number(bookForm.quantity),
        available_quantity: Number(bookForm.available_quantity)
      };
      if (editingBook) {
        await api.put(`books/${editingBook}/`, payload);
        notify("Book updated successfully");
      } else {
        await api.post("books/", payload);
        notify("Book added successfully");
      }
      setBookForm(emptyBook);
      setEditingBook(null);
      loadAll();
    } catch (err) {
      notify(JSON.stringify(err.response?.data || "Unable to save book"));
    }
  };

  const saveMember = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await api.put(`members/${editingMember}/`, memberForm);
        notify("Member updated successfully");
      } else {
        await api.post("members/", memberForm);
        notify("Member added successfully");
      }
      setMemberForm(emptyMember);
      setEditingMember(null);
      loadAll();
    } catch (err) {
      notify(JSON.stringify(err.response?.data || "Unable to save member"));
    }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`${type}/${id}/`);
      notify("Record deleted successfully");
      loadAll();
    } catch (err) {
      notify("Delete failed");
    }
  };

  const issueBook = async (bookId, memberId) => {
    const due = new Date();
    due.setDate(due.getDate() + 14);
    try {
      await api.post("loans/", {
        book: bookId,
        member: memberId,
        due_date: due.toISOString().slice(0, 10),
        status: "Issued"
      });
      notify("Book issued successfully");
      loadAll();
    } catch (err) {
      notify(JSON.stringify(err.response?.data || "Unable to issue book"));
    }
  };

  const returnBook = async (loan) => {
    try {
      await api.patch(`loans/${loan.id}/`, {
        status: "Returned",
        return_date: new Date().toISOString().slice(0, 10)
      });
      notify("Book returned successfully");
      loadAll();
    } catch {
      notify("Return failed");
    }
  };

  const filteredBooks = books.filter(b =>
    `${b.title} ${b.author} ${b.isbn} ${b.category}`
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header>
        <div>
          <h1>📚 Library Management System</h1>
          <p>Complete CRUD-based web application</p>
        </div>
      </header>

      <nav className="tabs">
        {["books", "members", "loans"].map(t =>
          <button className={tab === t ? "active" : ""} onClick={() => setTab(t)} key={t}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        )}
      </nav>

      {message && <div className="toast">{message}</div>}

      {tab === "books" && (
        <>
          <section className="card">
            <h2>{editingBook ? "Edit Book" : "Add New Book"}</h2>
            <form onSubmit={saveBook} className="form-grid">
              <input required placeholder="Book title" value={bookForm.title}
                onChange={e => setBookForm({...bookForm, title:e.target.value})}/>
              <input required placeholder="Author" value={bookForm.author}
                onChange={e => setBookForm({...bookForm, author:e.target.value})}/>
              <input required placeholder="ISBN" value={bookForm.isbn}
                onChange={e => setBookForm({...bookForm, isbn:e.target.value})}/>
              <input required placeholder="Category" value={bookForm.category}
                onChange={e => setBookForm({...bookForm, category:e.target.value})}/>
              <input required type="number" min="0" placeholder="Published year"
                value={bookForm.published_year}
                onChange={e => setBookForm({...bookForm, published_year:e.target.value})}/>
              <input required type="number" min="1" placeholder="Quantity"
                value={bookForm.quantity}
                onChange={e => {
                  const q=e.target.value;
                  setBookForm({...bookForm, quantity:q, available_quantity: editingBook ? bookForm.available_quantity : q});
                }}/>
              <input required type="number" min="0" placeholder="Available quantity"
                value={bookForm.available_quantity}
                onChange={e => setBookForm({...bookForm, available_quantity:e.target.value})}/>
              <div className="form-actions">
                <button className="primary">{editingBook ? "Update Book" : "Add Book"}</button>
                {editingBook && <button type="button" onClick={() => {setEditingBook(null);setBookForm(emptyBook)}}>Cancel</button>}
              </div>
            </form>
          </section>

          <section className="card">
            <div className="section-head">
              <h2>Books ({filteredBooks.length})</h2>
              <input className="search" placeholder="Search books..." value={search}
                onChange={e => setSearch(e.target.value)}/>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Title</th><th>Author</th><th>ISBN</th><th>Category</th><th>Qty</th><th>Available</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredBooks.map(b => <tr key={b.id}>
                    <td>{b.title}</td><td>{b.author}</td><td>{b.isbn}</td><td>{b.category}</td>
                    <td>{b.quantity}</td><td>{b.available_quantity}</td>
                    <td>
                      <button onClick={() => {setEditingBook(b.id);setBookForm(b)}}>Edit</button>
                      <button className="danger" onClick={() => deleteItem("books", b.id)}>Delete</button>
                    </td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {tab === "members" && (
        <>
          <section className="card">
            <h2>{editingMember ? "Edit Member" : "Add New Member"}</h2>
            <form onSubmit={saveMember} className="form-grid">
              <input required placeholder="Full name" value={memberForm.name}
                onChange={e => setMemberForm({...memberForm, name:e.target.value})}/>
              <input required type="email" placeholder="Email" value={memberForm.email}
                onChange={e => setMemberForm({...memberForm, email:e.target.value})}/>
              <input required pattern="[0-9]{10,15}" placeholder="Phone (10-15 digits)"
                value={memberForm.phone}
                onChange={e => setMemberForm({...memberForm, phone:e.target.value})}/>
              <div className="form-actions">
                <button className="primary">{editingMember ? "Update Member" : "Add Member"}</button>
                {editingMember && <button type="button" onClick={() => {setEditingMember(null);setMemberForm(emptyMember)}}>Cancel</button>}
              </div>
            </form>
          </section>

          <section className="card">
            <h2>Members ({members.length})</h2>
            <div className="table-wrap"><table>
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>{members.map(m => <tr key={m.id}>
                <td>{m.name}</td><td>{m.email}</td><td>{m.phone}</td><td>{m.joined_date}</td>
                <td><button onClick={() => {setEditingMember(m.id);setMemberForm({name:m.name,email:m.email,phone:m.phone})}}>Edit</button>
                <button className="danger" onClick={() => deleteItem("members", m.id)}>Delete</button></td>
              </tr>)}</tbody>
            </table></div>
          </section>
        </>
      )}

      {tab === "loans" && (
        <>
          <section className="card">
            <h2>Issue a Book</h2>
            <div className="issue-grid">
              <select id="issueBook">
                <option value="">Select available book</option>
                {books.filter(b => b.available_quantity > 0).map(b =>
                  <option value={b.id} key={b.id}>{b.title} ({b.available_quantity} available)</option>
                )}
              </select>
              <select id="issueMember">
                <option value="">Select member</option>
                {members.map(m => <option value={m.id} key={m.id}>{m.name}</option>)}
              </select>
              <button className="primary" onClick={() => {
                const b=document.getElementById("issueBook").value;
                const m=document.getElementById("issueMember").value;
                if (!b || !m) return notify("Select both book and member");
                issueBook(Number(b), Number(m));
              }}>Issue Book</button>
            </div>
          </section>

          <section className="card">
            <h2>Loan Records ({loans.length})</h2>
            <div className="table-wrap"><table>
              <thead><tr><th>Book</th><th>Member</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>{loans.map(l => <tr key={l.id}>
                <td>{l.book_title}</td><td>{l.member_name}</td><td>{l.issue_date}</td><td>{l.due_date}</td>
                <td><span className={l.status === "Returned" ? "badge returned" : "badge"}>{l.status}</span></td>
                <td>{l.status !== "Returned" && <button onClick={() => returnBook(l)}>Return</button>}</td>
              </tr>)}</tbody>
            </table></div>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
