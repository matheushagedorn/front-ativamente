<template>
    <div class="container-fluid bg-primary" style="user-select: none;">
        <div class="container d-flex flex-column align-items-center justify-content-center vh-100 bg-white">
            <img src="/src/assets/img/ativamente.png" alt="Carro" style="width: 20rem; height: 20rem;">
            <h1>AtivaMente</h1>

            <div class="d-flex flex-column align-items-center justify-content-center gap-2 mb-4 mt-4">
                <div class="form-floating">
                    <input type="email" class="form-control" id="matricula" placeholder="Matrícula do usuário" minlength="6" maxlength="6">
                    <label for="matricula">Matrícula do usuário</label>
                </div>
                <div class="form-floating">
                    <input type="number" class="form-control" id="cpf" placeholder="CPF do usuário" maxlength="11">
                    <label for="cpf">CPF</label>
                </div>
                <div class="form-floating">
                    <input type="password" class="form-control" id="senha" placeholder="Senha" minlenght="5">
                    <label for="senha">Senha</label>
                </div>
                <div class="form-floating">
                    <input type="password" class="form-control" id="confirmaSenha" placeholder="Confirme sua senha" minlenght="5">
                    <label for="confirmaSenha">Confirme sua senha</label>
                </div>
                <div class="form-floating">
                    <input type="nome" class="form-control" id="nome" placeholder="Nome completo">
                    <label for="nome">Nome completo</label>
                </div>
                <div class="form-floating">
                    <input type="email" class="form-control" id="email" placeholder="Email">
                    <label for="email">Email</label>
                </div>
                <button class="btn btn-primary text-light mt-4" @click="cadastrar">Cadastre-se</button>
                <router-link to="/"><button class="btn btn-primary text-light">Voltar para Login</button></router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
const router = useRouter()

async function cadastrar() {
    const matricula = document.getElementById('matricula').value;
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirmaSenha').value;
    const nomeCompleto = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!matricula && cpf && !nomeCompleto && !email) {
        Swal.fire({
            title: "Erro ao cadastrar usuário!",
            text: "Verifique as primaryrmações e tente novamente.",
            icon: "error"
        });
        return;
    }
    
    if (!emailRegex.test(email)) {
        Swal.fire({
            title: "Erro ao cadastrar usuário!",
            text: "Endereço de email inválido. Por favor, verifique e tente novamente.",
            icon: "error"
        });
        return;
    }

    if (senha !== confirmaSenha) {
        Swal.fire({
            title: "Erro ao cadastrar usuário!",
            text: "Verifique se as senhas se coincidem e tente novamente.",
            icon: "error"
        });
        return;
    }

    const response = await fetch('http://localhost:8080/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            matricula: matricula,
            cpf: cpf,
            senha: senha,
            nome: nomeCompleto,
            email: email,
        }),
    });

    if (response.ok) {
        Swal.fire({
            title: "Usuário cadastrado!",
            text: "Usuário cadastrado com sucesso!",
            icon: "success"
        }).then((result) => {
           if (result.isConfirmed) {
               router.push({ name: 'login' });
           }
        });
    } else {
        Swal.fire({
            title: "Erro!",
            text: "Erro ao cadastrar usuário!",
            icon: "danger"
        });
    }
}
</script>