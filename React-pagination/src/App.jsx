import React from "react";

const App = () => {
  return <div>App</div>;
};

export default App;

// import ReactPaginate from "react-paginate";
// import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
// import { IconContext } from "react-icons";
// import { useEffect, useState } from "react";
// import "./app.css";

// import React from "react";

// const App = () => {
//   const data = [
//     "A",
//     "B",
//     "C",
//     "D",
//     "E",
//     "F",
//     "G",
//     "H",
//     "I",
//     "J",
//     "K",
//     "L",
//     "M",
//     "N",
//     "O",
//     "P",
//     "Q",
//     "R",
//     "S",
//     "T",
//     "U",
//     "V",
//     "W",
//     "X",
//     "Y",
//     "Z",
//   ];
//   const [page, setPage] = useState(0);
//   const [filterData, setFilterData] = useState();
//   const n = 3;
//   useEffect(() => {
//     setFilterData(
//       data.filter((item, index) => {
//         return (index >= page * n) & (index < (page + 1) * n);
//       })
//     );
//   }, [page]);

//   return (
//     <>
//       <ul>
//         {filterData && filterData.map((item, index) => <li>Item #{item}</li>)}
//       </ul>
//       <ReactPaginate
//         containerClassName={"pagination"}
//         pageClassName={"page-item"}
//         activeClassName={"active"}
//         onPageChange={(event) => setPage(event.selected)}
//         pageCount={Math.ceil(data.length / n)}
//         breakLabel="..."
//         previousLabel={
//           <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
//             <AiFillLeftCircle />
//           </IconContext.Provider>
//         }
//         nextLabel={
//           <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
//             <AiFillRightCircle />
//           </IconContext.Provider>
//         }
//       />
//     </>
//   );
// };

// export default App;

// import React from "react";
// import { useEffect, useState } from "react";
// import Posts from "./components/Posts";
// const App = () => {
//   const [posts, setposts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       setLoading(true);
//       const resp = await fetch("https://jsonplaceholder.typicode.com/posts");
//       const data = await resp.json();
//       setposts(data);
//       setLoading(false);
//     };
//     fetchPosts();
//   }, []);

//   const indexOfLastPost = currentPage * postsPerPage;
//   const indexOfFirstPost = indexOfLastPost - postsPerPage;
//   const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

//   return (
//     <>
//       <div className="container">
//         <div className="main-heading">
//           <h1>Pagination</h1>
//           {loading && <h2>Posts are loading</h2>}
//           <Posts posts={currentPosts} />
//         </div>
//       </div>
//     </>
//   );
// };

// export default App;
