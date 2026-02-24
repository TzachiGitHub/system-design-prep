// ─────────────────────────────────────────────────────────────────────────────
// seed.ts — Initial Data
//
// This is your "database". The data is carefully designed to make queries
// interesting and to demonstrate GraphQL features clearly:
//
//  • Author "García Márquez" has 5 books — good for Author.books queries
//  • "The Hobbit" has 0 reviews — demonstrates nullable averageRating
//  • "One Hundred Years..." has 8 reviews averaging ~4.6 — topRatedBooks winner
//  • Same user (user-3) reviewed multiple books — good for User.reviews
//  • Books span all genres — good for filtering demos
// ─────────────────────────────────────────────────────────────────────────────

export type RawAuthor = {
  id: string;
  name: string;
  bio: string | null;
};

export type RawBook = {
  id: string;
  title: string;
  publishedYear: number;
  genre: string;
  authorId: string;
};

export type RawUser = {
  id: string;
  username: string;
  joinedAt: string; // ISO 8601
};

export type RawReview = {
  id: string;
  rating: number;
  body: string;
  createdAt: string; // ISO 8601
  bookId: string;
  userId: string;
};

export const seedAuthors: RawAuthor[] = [
  {
    id: 'author-1',
    name: 'Gabriel García Márquez',
    bio: 'Colombian novelist, short-story writer, screenwriter, and journalist. Nobel Prize in Literature 1982. Known for magical realism.',
  },
  {
    id: 'author-2',
    name: 'J.R.R. Tolkien',
    bio: 'English writer, poet, philologist, and academic. Best known for The Hobbit and The Lord of the Rings.',
  },
  {
    id: 'author-3',
    name: 'Ursula K. Le Guin',
    bio: 'American author of novels, children\'s books, and short stories. Mainly known for science fiction and fantasy.',
  },
  {
    id: 'author-4',
    name: 'Yuval Noah Harari',
    bio: 'Israeli public intellectual, historian, and author. Professor at the Hebrew University of Jerusalem.',
  },
  {
    id: 'author-5',
    name: 'Agatha Christie',
    bio: null, // demonstrates nullable bio field
  },
];

export const seedBooks: RawBook[] = [
  // García Márquez — 5 books (good for Author.books demo)
  {
    id: 'book-1',
    title: 'One Hundred Years of Solitude',
    publishedYear: 1967,
    genre: 'FICTION',
    authorId: 'author-1',
  },
  {
    id: 'book-2',
    title: 'Love in the Time of Cholera',
    publishedYear: 1985,
    genre: 'FICTION',
    authorId: 'author-1',
  },
  {
    id: 'book-3',
    title: 'Chronicle of a Death Foretold',
    publishedYear: 1981,
    genre: 'MYSTERY',
    authorId: 'author-1',
  },
  {
    id: 'book-4',
    title: 'The General in His Labyrinth',
    publishedYear: 1989,
    genre: 'HISTORY',
    authorId: 'author-1',
  },
  {
    id: 'book-5',
    title: 'The Autumn of the Patriarch',
    publishedYear: 1975,
    genre: 'FICTION',
    authorId: 'author-1',
  },

  // Tolkien
  {
    id: 'book-6',
    title: 'The Hobbit',
    publishedYear: 1937,
    genre: 'FANTASY',
    authorId: 'author-2',
    // NOTE: No reviews seeded for this book — demonstrates nullable averageRating
  },
  {
    id: 'book-7',
    title: 'The Fellowship of the Ring',
    publishedYear: 1954,
    genre: 'FANTASY',
    authorId: 'author-2',
  },

  // Le Guin
  {
    id: 'book-8',
    title: 'The Left Hand of Darkness',
    publishedYear: 1969,
    genre: 'SCIENCE',
    authorId: 'author-3',
  },
  {
    id: 'book-9',
    title: 'A Wizard of Earthsea',
    publishedYear: 1968,
    genre: 'FANTASY',
    authorId: 'author-3',
  },

  // Harari
  {
    id: 'book-10',
    title: 'Sapiens: A Brief History of Humankind',
    publishedYear: 2011,
    genre: 'HISTORY',
    authorId: 'author-4',
  },
  {
    id: 'book-11',
    title: 'Homo Deus: A Brief History of Tomorrow',
    publishedYear: 2015,
    genre: 'NON_FICTION',
    authorId: 'author-4',
  },

  // Christie
  {
    id: 'book-12',
    title: 'And Then There Were None',
    publishedYear: 1939,
    genre: 'MYSTERY',
    authorId: 'author-5',
  },
];

export const seedUsers: RawUser[] = [
  { id: 'user-1', username: 'bookworm42',    joinedAt: '2022-03-15T10:00:00Z' },
  { id: 'user-2', username: 'literati_luna', joinedAt: '2022-07-22T14:30:00Z' },
  { id: 'user-3', username: 'page_turner',   joinedAt: '2023-01-05T09:00:00Z' },
  { id: 'user-4', username: 'nightreader',   joinedAt: '2023-06-18T20:00:00Z' },
  { id: 'user-5', username: 'the_annotator', joinedAt: '2024-02-01T12:00:00Z' },
];

export const seedReviews: RawReview[] = [
  // One Hundred Years of Solitude — 8 reviews, high average (~4.6)
  { id: 'review-1',  rating: 5, body: 'A transcendent masterpiece. The prose is unlike anything I\'ve ever read.', createdAt: '2023-02-10T11:00:00Z', bookId: 'book-1', userId: 'user-1' },
  { id: 'review-2',  rating: 5, body: 'Magical realism at its finest. Changed how I see literature.', createdAt: '2023-03-05T15:00:00Z', bookId: 'book-1', userId: 'user-2' },
  { id: 'review-3',  rating: 4, body: 'Dense and rewarding. The family tree takes getting used to but it\'s worth it.', createdAt: '2023-04-12T09:30:00Z', bookId: 'book-1', userId: 'user-3' },
  { id: 'review-4',  rating: 5, body: 'Read it three times. Each time I find something new.', createdAt: '2023-05-20T18:00:00Z', bookId: 'book-1', userId: 'user-4' },
  { id: 'review-5',  rating: 5, body: 'The most important novel of the 20th century. No contest.', createdAt: '2023-06-01T10:00:00Z', bookId: 'book-1', userId: 'user-5' },
  { id: 'review-6',  rating: 4, body: 'Incredible world-building through generations. Slow in places but never dull.', createdAt: '2023-07-14T14:00:00Z', bookId: 'book-1', userId: 'user-2' },
  { id: 'review-7',  rating: 5, body: 'García Márquez creates a whole mythology. Phenomenal.', createdAt: '2023-08-03T16:00:00Z', bookId: 'book-1', userId: 'user-3' },
  { id: 'review-8',  rating: 4, body: 'Complex and beautiful. Not an easy read but absolutely worthwhile.', createdAt: '2023-09-11T11:00:00Z', bookId: 'book-1', userId: 'user-1' },

  // Love in the Time of Cholera — 4 reviews
  { id: 'review-9',  rating: 4, body: 'A deeply romantic story about obsession and devotion. Haunting.', createdAt: '2023-04-01T10:00:00Z', bookId: 'book-2', userId: 'user-1' },
  { id: 'review-10', rating: 3, body: 'Beautiful writing but the protagonist\'s obsession felt uncomfortable at times.', createdAt: '2023-05-10T12:00:00Z', bookId: 'book-2', userId: 'user-4' },
  { id: 'review-11', rating: 5, body: 'A love letter to love itself. Stunning.', createdAt: '2023-06-22T09:00:00Z', bookId: 'book-2', userId: 'user-3' },
  { id: 'review-12', rating: 4, body: 'García Márquez at his most tender. I cried.', createdAt: '2023-07-30T17:00:00Z', bookId: 'book-2', userId: 'user-5' },

  // Chronicle of a Death Foretold — 3 reviews
  { id: 'review-13', rating: 5, body: 'Short but devastating. Read it in one sitting.', createdAt: '2023-03-15T11:00:00Z', bookId: 'book-3', userId: 'user-2' },
  { id: 'review-14', rating: 4, body: 'A masterclass in dramatic irony. You know the ending from page one and still can\'t look away.', createdAt: '2023-07-05T14:00:00Z', bookId: 'book-3', userId: 'user-3' },
  { id: 'review-15', rating: 5, body: 'Brilliant structure. The inevitability of tragedy is suffocating in the best way.', createdAt: '2023-10-01T16:00:00Z', bookId: 'book-3', userId: 'user-1' },

  // Fellowship of the Ring — 3 reviews
  { id: 'review-16', rating: 5, body: 'The gold standard of fantasy world-building. Nothing comes close.', createdAt: '2023-01-20T10:00:00Z', bookId: 'book-7', userId: 'user-4' },
  { id: 'review-17', rating: 4, body: 'Slow start (the Shire chapters), but once it gets going it\'s unputdownable.', createdAt: '2023-02-28T15:00:00Z', bookId: 'book-7', userId: 'user-2' },
  { id: 'review-18', rating: 5, body: 'A lifetime of reading prepared me for this. Pure magic.', createdAt: '2023-11-15T20:00:00Z', bookId: 'book-7', userId: 'user-5' },

  // Sapiens — 4 reviews
  { id: 'review-19', rating: 5, body: 'Mind-expanding. Changed how I think about what it means to be human.', createdAt: '2023-08-10T09:00:00Z', bookId: 'book-10', userId: 'user-3' },
  { id: 'review-20', rating: 4, body: 'Brilliant synthesis of history, biology, and philosophy. Some speculative leaps but worth it.', createdAt: '2023-09-05T11:00:00Z', bookId: 'book-10', userId: 'user-1' },
  { id: 'review-21', rating: 5, body: 'The best non-fiction I\'ve read in a decade.', createdAt: '2023-10-20T14:00:00Z', bookId: 'book-10', userId: 'user-4' },
  { id: 'review-22', rating: 3, body: 'Interesting but Harari oversimplifies in places. Still worth reading.', createdAt: '2023-11-08T16:00:00Z', bookId: 'book-10', userId: 'user-2' },

  // And Then There Were None — 3 reviews
  { id: 'review-23', rating: 5, body: 'The best mystery novel ever written. The plot is airtight.', createdAt: '2023-05-25T11:00:00Z', bookId: 'book-12', userId: 'user-5' },
  { id: 'review-24', rating: 4, body: 'Genuinely suspenseful even when you know who did it. Christie is a genius.', createdAt: '2023-06-30T13:00:00Z', bookId: 'book-12', userId: 'user-3' },
  { id: 'review-25', rating: 5, body: 'Absolutely gripping. Finished it in one night.', createdAt: '2023-12-01T21:00:00Z', bookId: 'book-12', userId: 'user-1' },

  // NOTE: No reviews for book-6 (The Hobbit) — demonstrates nullable averageRating
];
