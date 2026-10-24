function displayPosts(posts) {
  const postList = document.querySelector("#post-list");

  posts.forEach((post) => {
    const listItem = document.createElement("li");
    const title = document.createElement("h1");
    const body = document.createElement("p");

    title.textContent = post.title;
    body.textContent = post.body;

    listItem.append(title, body);
    postList.append(listItem);
  });
}

async function fetchPosts() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`);
  }

  const posts = await response.json();
  displayPosts(posts);
}

fetchPosts();
