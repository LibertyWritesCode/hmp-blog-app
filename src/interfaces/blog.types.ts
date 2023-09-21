export interface SignUpRequestBody {
  name: string, 
  email: string, 
  password: string
}

export interface LoginRequestBody {
  email: string,
  password: string
}

export interface CreatePostRequestBody {
  title: string,
  content: string,
  author: string,
  tags: string [],
}

export interface UpdatePostRequestBody {
  title: string,
  content: string,
  tags: string []
}

export interface CommentOnPostRequestBody {
  comment: string,
}





  