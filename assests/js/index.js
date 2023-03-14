export function valida(input) {
    const tipoDeInput = input.dataset.tipo

    if (input.validity.valid) {
        input.parentElement.classList.remove('itens__formulario--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''

        class FormSubmit {
            constructor(settings) {
                this.settings = settings;
                this.form = document.querySelector(settings.form);
                this.formButton = document.querySelector(settings.button);
                if (this.form) {
                    this.url = this.form.getAttribute("action");
                }
                this.sendForm = this.sendForm.bind(this);
            }

            displaySuccess() {
                this.form.innerHTML = this.settings.success;
            }

            displayError() {
                this.form.innerHTML = this.settings.error;
            }

            getFormObject() {
                const formObject = {};
                const fields = this.form.querySelectorAll("[name]");
                fields.forEach((field) => {
                    formObject[field.getAttribute("name")] = field.value;
                });
                return formObject;
            }

            onSubmission(event) {
                event.preventDefault();
                event.target.disabled = true;
                event.target.innerText = "Enviando...";
            }

            async sendForm(event) {
                try {
                    this.onSubmission(event);
                    await fetch(this.url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify(this.getFormObject()),
                    });
                    this.displaySuccess();
                } catch (error) {
                    this.displayError();
                    throw new Error(error);
                }
            }

            init() {
                if (this.form) this.formButton.addEventListener("click", this.sendForm);
                return this;
            }
        }

        const formSubmit = new FormSubmit({
            form: "[data-form]",
            button: "[data-button]",
            success: "<h1 class='success'>Mensagem enviada!</h1>",
        });
        formSubmit.init();


    } else {
        input.parentElement.classList.add('itens__formulario--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoDeInput, input)
    }
}

const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]

const mensagensDeErro = {
    nome: {
        valueMissing: 'O campo de nome não pode estar vazio.'
    },
    email: {
        valueMissing: 'O campo de email não pode estar vazio.',
        typeMismatch: 'O email digitado não é válido.'
    },
    assunto: {
        valueMissing: 'O campo de nome não pode estar vazio.'
    }
}

function mostraMensagemDeErro(tipoDeInput, input) {
    let mensagem = ''
    tiposDeErro.forEach(erro => {
        if (input.validity[erro]) {
            mensagem = mensagensDeErro[tipoDeInput][erro]
        }
    })

    return mensagem
}
