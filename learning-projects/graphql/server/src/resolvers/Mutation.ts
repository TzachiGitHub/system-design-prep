// ─────────────────────────────────────────────────────────────────────────────
// Mutation.ts — Mutation Resolvers
//
// Key mutation design patterns demonstrated here:
//
//  1. Mutations return the affected/created object — not void.
//     This allows Apollo Client to update its InMemoryCache in one roundtrip
//     without a follow-up refetch query.
//
//  2. deleteReview returns the PARENT BOOK — so the client receives the
//     updated book (with the review removed from its reviews list).
//     Apollo Client uses Book.id to find the cached book and update it.
//
//  3. GraphQL errors: when validation fails, we throw a GraphQLError.
//     GraphQL responses can contain BOTH data AND errors simultaneously —
//     unlike REST where a 400 means no data. Other resolvers still succeed.
//
//  4. After mutating, we publish to PubSub so subscribed clients receive
//     the update in real-time.
// ─────────────────────────────────────────────────────────────────────────────

import { GraphQLError } from 'graphql';
import {
  books,
  reviews,
  findBookById,
  findAuthorById,
  findUserById,
  generateId,
} from '../data/store.js';
import { pubsub, EVENTS } from './Subscription.js';

type AddBookInput = {
  title: string;
  authorId: string;
  publishedYear: number;
  genre: string;
};

type AddReviewInput = {
  bookId: string;
  userId: string;
  rating: number;
  body: string;
};

export const MutationResolvers = {
  Mutation: {
    addBook: (_parent: undefined, args: { input: AddBookInput }) => {
      const { title, authorId, publishedYear, genre } = args.input;

      // Validate the referenced author exists
      const author = findAuthorById(authorId);
      if (!author) {
        throw new GraphQLError(`Author with id "${authorId}" not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const newBook = {
        id: generateId('book'),
        title,
        authorId,
        publishedYear,
        genre,
      };

      books.push(newBook);

      // Notify subscribed clients about the new book
      pubsub.publish(EVENTS.BOOK_ADDED, { bookAdded: newBook });

      // Return the new book — Apollo Client will merge this into its cache
      return newBook;
    },

    addReview: (_parent: undefined, args: { input: AddReviewInput }) => {
      const { bookId, userId, rating, body } = args.input;

      // Validate rating is within acceptable range
      if (rating < 1 || rating > 5) {
        throw new GraphQLError('Rating must be between 1 and 5', {
          extensions: {
            code: 'BAD_USER_INPUT',
            field: 'rating',
            received: rating,
          },
        });
      }

      // Validate referenced entities exist
      if (!findBookById(bookId)) {
        throw new GraphQLError(`Book with id "${bookId}" not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      if (!findUserById(userId)) {
        throw new GraphQLError(`User with id "${userId}" not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const newReview = {
        id: generateId('review'),
        rating,
        body,
        createdAt: new Date().toISOString(),
        bookId,
        userId,
      };

      reviews.push(newReview);

      // Notify subscribers watching this book for new reviews
      pubsub.publish(EVENTS.REVIEW_ADDED, { reviewAdded: newReview });

      return newReview;
    },

    // deleteReview returns the PARENT BOOK — not void, not the deleted review.
    // This is the key pattern: by returning the book with its updated reviews list,
    // Apollo Client can update the cached book without any refetch.
    deleteReview: (_parent: undefined, args: { id: string }) => {
      const reviewIndex = reviews.findIndex(r => r.id === args.id);
      if (reviewIndex === -1) {
        throw new GraphQLError(`Review with id "${args.id}" not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const [deletedReview] = reviews.splice(reviewIndex, 1);

      // Return the parent book so the client can update it in cache
      return findBookById(deletedReview.bookId);
    },
  },
};
