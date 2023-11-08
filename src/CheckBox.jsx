// import React, { useState } from "react";

// function CheckBox() {
//   return (
//     <div>
//       <section>
//         <div style={{ width: "800px", margin: "auto", padding: "10px" }}>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               width: "100%",
//             }}
//           >
//             <div>
//               <div style={{ marginBottom: "10px" }}>
//                 <input type="checkbox" /> Function
//               </div>
//               <ul style={{ listStyle: "none" }}>
//                 <li style={{ marginBottom: "10px" }}>
//                   <input type="checkbox" /> Menu
//                 </li>
//                 <li style={{ marginBottom: "10px" }}>
//                   <input type="checkbox" /> Cateogory
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <div style={{ marginBottom: "10px" }}>
//                 <input type="checkbox" /> View
//               </div>

//               <ul style={{ listStyle: "none" }}>
//                 <li style={{ marginBottom: "10px" }}>
//                   <input type="checkbox" id="1_view 1_menu" />
//                 </li>
//                 <li style={{ marginBottom: "10px" }}>
//                   <input type="checkbox" id="2_view 1_category" />
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <div style={{ marginBottom: "10px" }}>
//                 <input type="checkbox" /> Create
//               </div>
//               <ul style={{ listStyle: "none" }}>
//                 <li style={{ marginBottom: "10px" }}>
//                   <input type="checkbox" id="1_Create 2_menu" />
//                 </li>
//                 <li style={{ marginBottom: "10px" }}>
//                   <input type="checkbox" id="2_Create 2_category" />
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default CheckBox;

import React, { useState } from "react";

function CheckBox() {
  const sections = [
    {
      title: "Function",
      items: ["Menu", "Category"],
    },
    {
      title: "View",
      items: ["Menu C", "Category C"],
    },
    {
      title: "Create",
      items: ["Menu C", "Category C"],
    },
  ];

  const handleCheck = (e) => {
    console.log(e);
    switch (e) {
      case "Function":
        break;
      case "1_Menu_1_Function":
        //logic here
        console.log(e);

        
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <section>
        <div style={{ width: "800px", margin: "auto", padding: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {sections.map((section, index) => (
              <div key={index}>
                <div
                  style={{ marginBottom: "10px" }}
                  onClick={() => handleCheck(section.title)}
                >
                  <input type="checkbox" /> {section.title}
                </div>
                <ul style={{ listStyle: "none" }}>
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} style={{ marginBottom: "10px" }}>
                      <input
                        type="checkbox"
                        id={`${index + 1}_${item}_${itemIndex + 1}_${
                          section.title
                        }`}
                        onClick={() =>
                          handleCheck(
                            `${index + 1}_${item}_${itemIndex + 1}_${
                              section.title
                            }`
                          )
                        }
                      />{" "}
                      {item === "Menu" || item === "Category" ? item : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CheckBox;
