const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

//createElementOn redner
function renderCafe(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = "x";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);

  cafeList.appendChild(li);
  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("cafes").doc(id).delete();
  });
}

// getting data
//THIS ONE DEALS WITH DATA BUT NOT IN REAL TIME (MUST REFRESH TEH PAGE).... SO WE USE real-time listeners
// db.collection("cafes")
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       renderCafe(doc);
//     });
//   });

// saving data
form.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("cafes").add({
    name: form.name.value,
    city: form.city.value,
  });
  form.name.value = "";
  form.city.value = "";
});

// real-time listeners
db.collection("cafes")
  .orderBy("city")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      console.log(change.doc.data());
      if (change.type == "added") {
        renderCafe(change.doc);
      } else if (change.type == "removed") {
        let li = cafeList.querySelector("[data-id=" + change.doc.id + "]");
        cafeList.removeChild(li);
      }
    });
  });
