import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Blog.css';

interface Blog {
    _id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    thumbnail: string;
    position: number;
    deleted: boolean;
}

interface BlogResponse {
    recordBlog: Blog[];
}

const Blog: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get<BlogResponse>('http://localhost:5000/blog');
                setBlogs(response.data.recordBlog);
            } catch (err) {
                console.error('Error fetching blogs:', err);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div style={{background: '#f0e6d2'}}>
            <div className="container" >
                <nav className="mb-8">
                    <ol className="breadcrumb">
                        <li>
                            <Link to="/" className="hover:text-primary">
                                Home
                            </Link>
                        </li>
                        <li className="mx-2">/</li>
                        <li>Blog</li>
                    </ol>
                </nav>

                <h1>CoffeeKing Store Blog</h1>

                {blogs.length === 0 ? (
                    <div className="text-center py-4">
                        <p>Chưa có blog nào được tạo</p>
                    </div>
                ) : (
                    <div className="grid">
                        {blogs.map((blog) => (
                            <div key={blog._id} className="card">
                                <img
                                    src={
                                        blog.thumbnail
                                            ? blog.thumbnail.startsWith("http")
                                                ? blog.thumbnail
                                                : `http://localhost:5000${blog.thumbnail}`
                                            : "http://localhost:5000/path-to-placeholder-image.png"
                                    }
                                    alt={blog.title}
                                />
                                <div className="card-content">
                                    <h2>{blog.title}</h2>
                                    <p>{blog.description}</p>
                                    <time>{new Date(blog.createdAt).toLocaleDateString()}</time>
                                </div>
                                {/* <div className="card-footer">
                                <Link to={`/blog/${blog._id}`} className="btn">
                                    Read More
                                </Link>
                            </div> */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>


    );
};

export default Blog;


