// Lazy Loading
import fetch from 'node-fetch';
import { GetAllPostRequest } from '../interfaces/blog.types';   
// import { GetAllPostResponse } from '../interfaces/blog.response';



export const getAllBlogPost = async (request: GetAllPostRequest): Promise<any> => {
  const { searchTerm, page, perPage, order } = request;

  let url = `${URL}/post?q=${searchTerm}`;
  if (page) {
    url += `&page=${page}`;
  }
  if (perPage) {
    url += `&per_page=${perPage}`;
  }
  if (order) {
    url += `&order=${order}`;
  }

  const response = await fetch(url);
  return await response.json();
}