export interface CreatePostRequestBody {
    title: string,
    content: string,
    author: string,
  }
  
  export interface GetAPostRequestBody {
    title: String,
    content: String
  }

  export interface EditPostRequestBody {
    title: string,
    content: string,
  }