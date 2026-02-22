const AddBookPage = () => {
  const submitForm = (e) => {
    e.preventDefault();
    console.log("submitForm called");
  };

  return (
    <div className="create">
      <h2>Add a New Book</h2>
      <form onSubmit={submitForm}>
        <label>Book Title:</label>
        <input type="text" required />
        <label>Author:</label>
        <input type="text" required />
        <label>ISBN:</label>
        <input type="text" required />
        <label>Publisher:</label>
        <input type="text" required />
        <label>Genre:</label>
        <input type="text" required />
        <label>Available:</label>
        <select>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <label>Due Date:</label>
        <input type="date" />
        <label>Borrower:</label>
        <input type="text" />
        <button>Add Book</button>
      </form>
    </div>
  );
};

export default AddBookPage;
