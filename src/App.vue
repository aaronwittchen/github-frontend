<template>
  <div class="container">
    <h1>GitHub User Summary</h1>
    <input v-model="username" type="text" placeholder="Enter GitHub username" />
    <button @click="getSummary">Get Summary</button>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="user" class="summary">
      <h2>{{ user.name || user.username }}</h2>
      <img :src="user.avatarUrl" alt="Avatar" width="100" />
      <p><strong>Bio:</strong> {{ user.bio }}</p>
      <p><strong>Location:</strong> {{ user.location }}</p>
      <p><strong>Company:</strong> {{ user.company }}</p>
      <p>
        <strong>Blog:</strong>
        <a :href="user.blog" target="_blank">{{ user.blog }}</a>
      </p>
      <p><strong>Followers:</strong> {{ user.followers }}</p>
      <p><strong>Following:</strong> {{ user.following }}</p>
      <p><strong>Public Repos:</strong> {{ user.publicRepos }}</p>

      <h3>Top Repositories</h3>
      <ul>
        <li v-for="repo in user.topRepositories" :key="repo.name">
          <a :href="repo.htmlUrl" target="_blank">{{ repo.name }}</a>
          (⭐ {{ repo.stars }}) - {{ repo.language }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GithubSummary',
  data() {
    return {
      username: '',
      user: null,
      loading: false,
      error: '',
    };
  },
  methods: {
    async getSummary() {
      if (!this.username) return;
      this.loading = true;
      this.error = '';
      this.user = null;

      try {
        const res = await fetch(
          `http://localhost:3000/api/user/${this.username}/summary`
        );
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        this.user = await res.json();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.container {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  font-family: sans-serif;
}
input {
  padding: 0.5rem;
  margin-right: 1rem;
}
button {
  padding: 0.5rem 1rem;
}
.error {
  color: red;
  margin-top: 1rem;
}
.summary img {
  border-radius: 50%;
}
</style>
