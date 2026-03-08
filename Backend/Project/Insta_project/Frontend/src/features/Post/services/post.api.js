import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function getPostsFeed() {
    const response = await api.get("/api/posts/feed");
    return response;
}

export async function createPosts(caption, image) {
    const data = new FormData();
    data.append("caption", caption);
    data.append("image", image);
    const response = await api.post("/api/posts/", data);
    return response;
}

