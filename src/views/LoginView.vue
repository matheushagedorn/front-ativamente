<template>
  <form @submit.prevent="login">
    <div class="container-fluid bg-primary" style="user-select: none;">
      <div class="container d-flex flex-column align-items-center justify-content-center vh-100 bg-white">
        <img src="/src/assets/img/ativamente.png" style="width: 20rem; height: 20rem;" alt="Carro">
        <h1>AtivaMente</h1>
        
        <div class="d-flex flex-column align-items-start justify-content-start gap-2 mb-4" style="margin: 1rem">
          <div class="form-floating">
            <input type="text" class="form-control" id="matricula" placeholder="Matrícula do usuário" maxlength="6">
            <label for="matricula">Matrícula do usuário</label>
          </div>
          <div class="form-floating">
            <input type="password" class="form-control" id="senha" placeholder="Senha">
            <label for="senha">Senha</label>
          </div>
        </div>
        <button type="submit" class="btn btn-primary text-light">Entrar</button>
        <router-link to="register">
          <button style="margin-top: 0.75rem;" class="btn btn-primary text-light">Registre-se</button>
        </router-link>
      </div>
    </div>
  </form>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
const router = useRouter()

const data = ref([]);

async function login() {
  const matricula = document.getElementById('matricula').value;
  const senha = document.getElementById('senha').value;

  try {
    const response = await fetch(`http://localhost:8080/usuarios/matricula/${matricula}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    let responseData = await response.json();
    data.value = responseData

    if (data.value.senha === senha) {
      router.push({ name: 'home' });
      localStorage.setItem('usuario', JSON.stringify(data.value));
    } else {
      Swal.fire({
        title: "Senha incorreta!",
        text: "A senha informada está incorreta. Digite sua senha e tente novamente.",
        icon: "error"
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Usuário não encontrado!",
      text: "Nenhum usuário foi encontrado com a matrícula informada. Verifique se a matrícula está correta e tente novamente.",
      icon: "error"
    });
  }
}

function limpaInput(){
  matricula = ""
  senha = ""
}

</script>
