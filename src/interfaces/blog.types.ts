// Interface for the request body when signing up a user
export interface SignUpRequestBody {
  name: string,        // User's name
  email: string,       // User's email
  password: string    // User's password
}

// Interface for the request body when logging in a user
export interface LoginRequestBody {
  email: string,       // User's email
  password: string    // User's password
}

// Interface for the request body when creating a new post
export interface CreatePostRequestBody {
  title: string,       // Title of the post
  content: string,     // Content of the post
  author: string,      // Author of the post which is the user's ID
  tags?: string[]      // Optional array of tags for the post
}

// Interface for the request when getting all posts
export type GetAllPostRequest = {
  searchTerm: string;  // Search term for filtering posts
  page?: number;       // Optional page number for pagination
  perPage?: number;    // Optional number of posts per page
  order?: 'asc' | 'desc'; // Optional order for sorting posts (ascending or descending)
}

// Interface for the request body when updating a post
export interface UpdatePostRequestBody {
  title: string,       // New title for the post
  content: string,     // New content for the post
  tags?: string[]      // Optional array of updated tags for the post
}

// Interface for the request body when adding a comment to a post
export interface CommentOnPostRequestBody {
  comment: string,      // The comment text
}
