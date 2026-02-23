// import axios from 'axios';
// import { useState } from 'react';

// const ContentUploadSamplee = () => {

//     const [name, setName] = useState("");
//     const [headline, setHeadline] = useState("");
//     const [designations, setDesignations] = useState("");
//     const [bannerImage, setBannerImage] = useState(null);
//     const [smallImage, setSmallImage] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const formData = new FormData();

//         // text fields
//         formData.append("name", name);
//         formData.append("headline", headline);

//         // IMPORTANT: array must be stringified
//         formData.append(
//         "designations",
//         JSON.stringify(designations.split(","))
//         );

//         // image fields (names must match multer)
//         formData.append("BannerImage", bannerImage);
//         formData.append("smallBannerImage", smallImage);

//         try {
//         const res = await axios.put(
//             "http://localhost:4000/api/banners",
//             formData
//         );

//         console.log("Success:", res.data);
//         alert("Banner uploaded successfully");
//         } catch (error) {
//         console.error("Upload error:", error);
//         alert("Upload failed");
//         }
//     };

//   return (
//     <>
//         <div style={{ padding: 20 }}>
//             <h2>Banner Upload Test</h2>

//             <form onSubmit={handleSubmit}>
//                 <div>
//                 <input
//                     type="text"
//                     placeholder="Name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                 />
//                 </div>

//                 <div>
//                 <input
//                     type="text"
//                     placeholder="Headline"
//                     value={headline}
//                     onChange={(e) => setHeadline(e.target.value)}
//                     required
//                 />
//                 </div>

//                 <div>
//                 <input
//                     type="text"
//                     placeholder="Designations (comma separated)"
//                     value={designations}
//                     onChange={(e) => setDesignations(e.target.value)}
//                     required
//                 />
//                 </div>

//                 <div>
//                 <label>Banner Image:</label>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setBannerImage(e.target.files[0])}
//                     required
//                 />
//                 </div>

//                 <div>
//                 <label>Small Image:</label>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setSmallImage(e.target.files[0])}
//                     required
//                 />
//                 </div>

//                 <button type="submit">Upload Banner</button>
//             </form>
//         </div>
//     </>
//   )
// }

// export default ContentUploadSamplee
























// import axios from 'axios';
// import { useState } from 'react';

// const ContentUploadSamplee = () => {

//     const [skillName, setSkillName] = useState("");
//     const [skillContent, setSkillContent] = useState("");
//     const [skillUse, setSkillUse] = useState("");
//     const [skillImageURL, setSkillImageURL] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const formData = new FormData();

//         // text fields
//         formData.append("skillName", skillName);
//         formData.append("skillContent", skillContent);

//         // IMPORTANT: array must be stringified
//         formData.append("skillUse", skillUse);

//         // image fields (names must match multer)
//         formData.append("skillImageURL", skillImageURL);

//         try {
//         const res = await axios.post(
//             "http://localhost:4000/api/skills",
//             formData
//         );

//         console.log("Success:", res.data);
//         alert("Skills uploaded successfully");
//         } catch (error) {
//         console.error("Upload error:", error);
//         alert("Upload failed");
//         }
//     };

//   return (
//     <>
//         <div style={{ padding: 20 }}>
//             <h2>Banner Upload Test</h2>

//             <form onSubmit={handleSubmit}>
//                 <div>
//                 <input
//                     type="text"
//                     placeholder="skillName"
//                     value={skillName}
//                     onChange={(e) => setSkillName(e.target.value)}
//                     required
//                 />
//                 </div>

//                 <div>
//                 <input
//                     type="text"
//                     placeholder="skillContent"
//                     value={skillContent}
//                     onChange={(e) => setSkillContent(e.target.value)}
//                     required
//                 />
//                 </div>

//                 <div>
//                 <input
//                     type="text"
//                     placeholder="skillUse"
//                     value={skillUse}
//                     onChange={(e) => setSkillUse(e.target.value)}
//                     required
//                 />
//                 </div>

//                 <div>
//                 <label>Banner Image:</label>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setSkillImageURL(e.target.files[0])}
//                     required
//                 />
//                 </div>

//                 <button type="submit">Upload Banner</button>
//             </form>
//         </div>
//     </>
//   )
// }

// export default ContentUploadSamplee















import axios from "axios";
import { useState } from "react";

const ContentUploadSamplee = () => {
  const [projectName, setProjectName] = useState("");
  const [projectURL, setProjectURL] = useState("");
  const [projectImageURL, setProjectImageURL] = useState(null);

  const [frontend, setFrontend] = useState("");
  const [backend, setBackend] = useState("");
  const [tools, setTools] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // text fields
    formData.append("projectName", projectName);
    formData.append("projectURL", projectURL);

    // stack object → JSON string
    formData.append(
      "stack",
      JSON.stringify({
        frontend: frontend.split(","),
        backend: backend.split(","),
        tools: tools.split(","),
        tags: tags.split(","),
      })
    );

    // image file (NOT URL)
    formData.append("projectImageURL", projectImageURL);

    try {
      const res = await axios.post(
        "https://rudradaveportfolio.onrender.com/api/projects",
        formData
      );

      console.log(res.data);
      alert("Project uploaded successfully");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Project Upload</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Project URL"
          value={projectURL}
          onChange={(e) => setProjectURL(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Frontend (comma separated)"
          value={frontend}
          onChange={(e) => setFrontend(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Backend (comma separated)"
          value={backend}
          onChange={(e) => setBackend(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Tools (comma separated)"
          value={tools}
          onChange={(e) => setTools(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProjectImageURL(e.target.files[0])}
          required
        />

        <button type="submit">Upload Project</button>
      </form>
    </div>
  );
};

export default ContentUploadSamplee;



























