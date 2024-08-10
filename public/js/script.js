const params = new URLSearchParams(window.location.search);
const message = params.get("message");

if (message) {
  alert(message);
}

document.querySelectorAll(".like, .dislike").forEach((el) => {
  el.addEventListener("click", async (event) => {
    const action = event.target.className;
    const postId = event.target.closest(".status").id;
    console.log(postId, action);

    fetch(`/api/status/${postId}/likes`, {
      body: JSON.stringify({ action }),
      method: "post",
    });
  });
});
