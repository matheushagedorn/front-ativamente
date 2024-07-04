<template>
  <main>
    <div
      class="d-flex flex-column flex-shrink-0 p-3 bg-light"
      style="width: 280px"
    >
      <router-link
        to="/home"
        class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
      >
        <img
          src="/src/assets/img/ativamente.png"
          class="bi me-2"
          width="48"
          height="48"
          alt="AtivaMente"
        />
        <span class="fs-4">AtivaMente</span>
      </router-link>
      <hr />
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <router-link
            v-for="item in modulos"
            :key="item.name"
            :to="item.href"
            class="nav-link"
            :class="{ active: item.href === moduloAtivo }"
            aria-current="page"
          >
            <button
              class="btn-custom"
              :class="{ 'btn-custom-active': item.href === moduloAtivo }"
            >
              <i :class="item.icon"></i>
              {{ item.name }}
            </button>
          </router-link>
        </li>
      </ul>
      <hr />
      <div class="dropdown">
        <a
          href="#"
          class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle"
          id="dropdownUser2"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="fa-solid fa-user me-2"></i>
          <strong>{{ usuario }}</strong>
        </a>
        <ul
          class="dropdown-menu text-small shadow"
          aria-labelledby="dropdownUser2"
        >
          <li><a class="dropdown-item" href="#">Configurações</a></li>
          <li>
            <router-link to="perfil"><a class="dropdown-item">Perfil</a></router-link>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li><a class="dropdown-item" @click="sair">Sair</a></li>
        </ul>
      </div>
    </div>
    <div class="b-example-divider"></div>
    <router-view/>
  </main>
</template>

<script setup>
import { ref , watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const usuario = ref("");
const abreMenu = ref(false);
const moduloAtivo = ref('/home');

async function sair() {
  await router.push({ name: "login" });
}

if (localStorage.getItem("usuario") === null) {
  router.push({ name: "login" });
} else {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
  usuario.value = usuarioLogado.nome;
}

function menuUsuario() {
  abreMenu.value = !abreMenu.value;
}

function editarPerfil() {
  console.log("Editar perfil clicado");
}

const modulos = [
  {
    name: "Home",
    href: "/home",
    icon: "fa-solid fa-house",
  },
  {
    name: "Eventos",
    href: "/eventos",
    icon: "fa-regular fa-calendar",
  },
  {
    name: "Gestão de usuários",
    href: "/gestao-usuarios",
    icon: "fa-solid fa-user",
  },
];

watch(() => router.currentRoute.value.path, (newPath) => {
  moduloAtivo.value = newPath;
});

(function () {
  "use strict";
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
})();
</script>

<style scoped>
.btn-custom {
  color: black;
  background-color: transparent;
  border: none;
  outline: none;
}

.btn-custom-active {
  color: white;
}

/* Estilos restantes */
.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}

body {
  user-select: none;
  min-height: 100vh;
  min-height: -webkit-fill-available;
}

html {
  height: -webkit-fill-available;
}

main {
  display: flex;
  flex-wrap: nowrap;
  height: 100vh;
  height: -webkit-fill-available;
  max-height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
}

.b-example-divider {
  flex-shrink: 0;
  width: 1.5rem;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow: inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.bi {
  vertical-align: -0.125em;
  pointer-events: none;
  fill: currentColor;
}

.dropdown-toggle {
  outline: 0;
}

.nav-flush .nav-link {
  border-radius: 0;
}

.btn-toggle {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
  background-color: transparent;
  border: 0;
}

.btn-toggle:hover,
.btn-toggle:focus {
  color: rgba(0, 0, 0, 0.85);
  background-color: #d2f4ea;
}

.btn-toggle::before {
  width: 1.25em;
  line-height: 0;
  content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
  transition: transform 0.35s ease;
  transform-origin: 0.5em 50%;
}

.btn-toggle[aria-expanded="true"] {
  color: rgba(0, 0, 0, 0.85);
}

.btn-toggle[aria-expanded="true"]::before {
  transform: rotate(90deg);
}

.btn-toggle-nav a {
  display: inline-flex;
  padding: 0.1875rem 0.5rem;
  margin-top: 0.125rem;
  margin-left: 1.25rem;
  text-decoration: none;
}

.btn-toggle-nav a:hover,
.btn-toggle-nav a:focus {
  background-color: #d2f4ea;
}

.scrollarea {
  overflow-y: auto;
}

.fw-semibold {
  font-weight: 600;
}

.lh-tight {
  line-height: 1.25;
}

</style>