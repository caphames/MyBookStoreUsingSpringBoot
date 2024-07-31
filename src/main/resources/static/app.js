document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('books');
    const bookForm = document.getElementById('book-form');
    const bookIdInput = document.getElementById('book-id');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const priceInput = document.getElementById('price');

    const apiBaseUrl = '/api/books';

    const fetchBooks = async () => {
        try {
            const response = await axios.get(apiBaseUrl);
            const books = response.data;
            bookList.innerHTML = '';
            books.forEach(book => {
                const li = document.createElement('li');
                li.textContent = `${book.title} by ${book.author} - $${book.price}`;
                li.innerHTML += ` <button onclick="editBook(${book.id})">Edit</button>
                                  <button onclick="deleteBook(${book.id})">Delete</button>`;
                bookList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const saveBook = async (event) => {
        event.preventDefault();
        const book = {
            title: titleInput.value,
            author: authorInput.value,
            price: parseFloat(priceInput.value)
        };

        try {
            if (bookIdInput.value) {
                await axios.put(`${apiBaseUrl}/${bookIdInput.value}`, book);
            } else {
                await axios.post(apiBaseUrl, book);
            }
            bookForm.reset();
            bookIdInput.value = '';
            fetchBooks();
        } catch (error) {
            console.error('Error saving book:', error);
        }
    };

    window.editBook = (id) => {
        const book = Array.from(bookList.children).find(li => li.querySelector('button').onclick.toString().includes(`editBook(${id})`));
        if (book) {
            const [title, author, price] = book.textContent.split(' by ')[0].split(' - $');
            bookIdInput.value = id;
            titleInput.value = title;
            authorInput.value = author;
            priceInput.value = parseFloat(price);
        }
    };

    window.deleteBook = async (id) => {
        try {
            await axios.delete(`${apiBaseUrl}/${id}`);
            fetchBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    bookForm.addEventListener('submit', saveBook);
    fetchBooks();
});
