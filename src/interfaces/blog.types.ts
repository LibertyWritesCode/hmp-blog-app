export interface CreatePostRequestBody {
  title: string,
  content: string,
  author: string,
  tags: String [],
}

export interface UpdatePostRequestBody {
  title: string,
  content: string,
  tags: String []
}

export interface CommentOnPostRequestBody {
  comment: string,
}





  