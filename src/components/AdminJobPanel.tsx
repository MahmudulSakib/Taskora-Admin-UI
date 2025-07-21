// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// export default function AdminJobPostPanel() {
//   const [posts, setPosts] = useState<any[]>([]);
//   const [editing, setEditing] = useState<string | null>(null);
//   const [formData, setFormData] = useState<any>({});
//   const [image, setImage] = useState<File | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const postsPerPage = 50;

//   const fetchPosts = async () => {
//     const res = await axios.get("http://localhost:8080/admin/job-posts", {
//       withCredentials: true,
//     });
//     setPosts(res.data || []);
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const handleEdit = (post: any) => {
//     setEditing(post.id);
//     setFormData(post);
//     setImage(null);
//   };

//   const handleChange = (e: any) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSave = async () => {
//     const payload = new FormData();
//     payload.append("title", formData.title);
//     payload.append("link", formData.link);
//     payload.append("description", formData.description);
//     payload.append("status", formData.status);
//     payload.append("imageUrl", formData.imageUrl);
//     if (image) payload.append("image", image);

//     await axios.put(
//       `http://localhost:8080/admin/job-posts/${editing}`,
//       payload,
//       {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       }
//     );

//     setEditing(null);
//     setFormData({});
//     setImage(null);
//     fetchPosts();
//   };

//   const handleCancel = () => {
//     setEditing(null);
//     setFormData({});
//     setImage(null);
//   };

//   const indexOfLastPost = currentPage * postsPerPage;
//   const indexOfFirstPost = indexOfLastPost - postsPerPage;
//   const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
//   const totalPages = Math.ceil(posts.length / postsPerPage);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-semibold mb-4">Admin Job Posts Panel</h1>
//       <div className="overflow-auto">
//         <table className="min-w-full border border-gray-300">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 border">User</th>
//               <th className="p-2 border">Title</th>
//               <th className="p-2 border">Link</th>
//               <th className="p-2 border">Description</th>
//               <th className="p-2 border">Image</th>
//               <th className="p-2 border">Total</th>
//               <th className="p-2 border">Status</th>
//               <th className="p-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentPosts.map((post) => (
//               <tr key={post.id} className="align-top">
//                 <td className="p-2 border text-sm max-w-[200px]">
//                   <div className="font-medium truncate">
//                     {post.user.fullName}
//                   </div>
//                   <div className="text-xs text-gray-500 truncate">
//                     {post.user.email}
//                   </div>
//                 </td>
//                 <td className="p-2 border max-w-[200px] overflow-y-auto text-sm">
//                   {editing === post.id ? (
//                     <Input
//                       name="title"
//                       value={formData.title}
//                       onChange={handleChange}
//                       className="w-full"
//                     />
//                   ) : (
//                     <div className="whitespace-pre-wrap break-words">
//                       {post.title}
//                     </div>
//                   )}
//                 </td>
//                 <td className="p-2 border max-w-[200px] overflow-y-auto text-sm">
//                   {editing === post.id ? (
//                     <Input
//                       name="link"
//                       value={formData.link}
//                       onChange={handleChange}
//                       className="w-full"
//                     />
//                   ) : (
//                     <a
//                       href={post.link}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="text-blue-600 underline break-all"
//                     >
//                       {post.link}
//                     </a>
//                   )}
//                 </td>
//                 <td className="p-2 border max-w-[300px] overflow-y-auto text-sm">
//                   {editing === post.id ? (
//                     <Textarea
//                       name="description"
//                       value={formData.description}
//                       onChange={handleChange}
//                       className="w-full"
//                     />
//                   ) : (
//                     <div className="whitespace-pre-wrap break-words max-h-[60px] overflow-y-auto">
//                       {post.description}
//                     </div>
//                   )}
//                 </td>
//                 <td className="p-2 border">
//                   {editing === post.id ? (
//                     <div className="space-y-1">
//                       <Input
//                         type="file"
//                         onChange={(e) => setImage(e.target.files?.[0] || null)}
//                       />
//                       {formData.imageUrl && (
//                         <img
//                           src={formData.imageUrl}
//                           alt="preview"
//                           className="w-16 h-16 rounded"
//                         />
//                       )}
//                     </div>
//                   ) : (
//                     <img
//                       src={post.imageUrl}
//                       alt="job"
//                       className="w-16 h-16 rounded"
//                     />
//                   )}
//                 </td>
//                 <td className="p-2 border text-sm font-medium">
//                   ৳{post.totalCost}
//                 </td>
//                 <td className="p-2 border">
//                   {editing === post.id ? (
//                     <select
//                       name="status"
//                       value={formData.status}
//                       onChange={handleChange}
//                       className="bg-white border px-2 py-1 rounded"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="accepted">Accepted</option>
//                       <option value="rejected">Rejected</option>
//                     </select>
//                   ) : (
//                     <span
//                       className={`font-bold text-xs px-2 py-1 rounded-full inline-block ${
//                         post.status === "accepted"
//                           ? "bg-green-100 text-green-700"
//                           : post.status === "rejected"
//                           ? "bg-red-100 text-red-700"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {post.status.toUpperCase()}
//                     </span>
//                   )}
//                 </td>
//                 <td className="p-2 border">
//                   {editing === post.id ? (
//                     <div className="flex gap-2">
//                       <Button size="sm" onClick={handleSave}>
//                         Save
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={handleCancel}
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   ) : (
//                     <Button size="sm" onClick={() => handleEdit(post)}>
//                       Edit
//                     </Button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {totalPages > 1 && (
//           <div className="flex justify-center mt-4 gap-2">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 className={`px-3 py-1 rounded border text-sm font-medium ${
//                   page === currentPage
//                     ? "bg-blue-600 text-white"
//                     : "bg-white text-gray-700"
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export default function AdminJobPostPanel() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [image, setImage] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const postsPerPage = 50;

  const fetchPosts = async () => {
    const res = await axios.get(
      "https://taskora-admin-backend.onrender.com/admin/job-posts",
      {
        withCredentials: true,
      }
    );
    setPosts(res.data || []);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post: any) => {
    setEditing(post.id);
    setFormData(post);
    setImage(null);
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("link", formData.link);
    payload.append("description", formData.description);
    payload.append("status", formData.status);
    payload.append("imageUrl", formData.imageUrl);
    if (image) payload.append("image", image);

    await axios.put(
      `https://taskora-admin-backend.onrender.com/admin/job-posts/${editing}`,
      payload,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    setEditing(null);
    setFormData({});
    setImage(null);
    fetchPosts();
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({});
    setImage(null);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="p-4 relative">
      <h1 className="text-2xl font-semibold mb-4">Admin Job Posts Panel</h1>
      <div className="overflow-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Link</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post) => (
              <tr key={post.id} className="align-top">
                <td className="p-2 border text-sm max-w-[200px]">
                  <div className="font-medium truncate">
                    {post.user.fullName}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {post.user.email}
                  </div>
                </td>
                <td className="p-2 border max-w-[200px] overflow-y-auto text-sm">
                  {editing === post.id ? (
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full"
                    />
                  ) : (
                    <div className="whitespace-pre-wrap break-words">
                      {post.title}
                    </div>
                  )}
                </td>
                <td className="p-2 border max-w-[200px] overflow-y-auto text-sm">
                  {editing === post.id ? (
                    <Input
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      className="w-full"
                    />
                  ) : (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {post.link}
                    </a>
                  )}
                </td>
                <td className="p-2 border max-w-[300px] overflow-y-auto text-sm">
                  {editing === post.id ? (
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full"
                    />
                  ) : (
                    <div className="whitespace-pre-wrap break-words max-h-[60px] overflow-y-auto">
                      {post.description}
                    </div>
                  )}
                </td>
                <td className="p-2 border">
                  {editing === post.id ? (
                    <div className="space-y-1">
                      <Input
                        type="file"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                      />
                      {formData.imageUrl && (
                        <img
                          src={formData.imageUrl}
                          alt="preview"
                          className="w-16 h-16 rounded"
                        />
                      )}
                    </div>
                  ) : (
                    <img
                      src={post.imageUrl}
                      alt="job"
                      className="w-16 h-16 rounded cursor-pointer"
                      onClick={() => setPreviewImage(post.imageUrl)}
                    />
                  )}
                </td>
                <td className="p-2 border text-sm font-medium">
                  ৳{post.totalCost}
                </td>
                <td className="p-2 border">
                  {editing === post.id ? (
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="bg-white border px-2 py-1 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  ) : (
                    <span
                      className={`font-bold text-xs px-2 py-1 rounded-full inline-block ${
                        post.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : post.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.status.toUpperCase()}
                    </span>
                  )}
                </td>
                <td className="p-2 border">
                  {editing === post.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => handleEdit(post)}>
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border text-sm font-medium ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {previewImage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative">
            <button
              className="absolute top-1 right-1 text-white hover:text-red-400"
              onClick={() => setPreviewImage(null)}
            >
              <X size={28} />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[90vh] rounded shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
