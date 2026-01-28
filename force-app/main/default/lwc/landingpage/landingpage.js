import { LightningElement } from 'lwc';
import createLead from '@salesforce/apex/PublicLeadController.createLead';
import registerAccess from '@salesforce/apex/PublicLeadController.registerAccess';

export default class Landingpage extends LightningElement {
    loading = false;
    buttonLabel = 'Solicitar contato';
    showNotification = false;
    notificationMessage = '';
    notificationType = 'success';

    get notificationClass() {
        return `custom-toast ${this.notificationType}`;
    }

    connectedCallback() {
        if (registerAccess) {
            registerAccess()
                .then(() => console.log('Acesso registrado com sucesso.'))
                .catch(error => console.error('Erro no registro:', error));
        }
    }

    scrollToForm() {
        const formElement = this.template.querySelector('[data-form]');
        if (formElement) {
            const topCoordinate = formElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: topCoordinate - 80,
                behavior: 'smooth'
            });
        }
    }

    handleSubmit(event) {
        event.preventDefault(); 
        
        const nomeInput = this.template.querySelector('[data-field="nome"]');
        const emailInput = this.template.querySelector('[data-field="email"]');
        const empresaInput = this.template.querySelector('[data-field="empresa"]');
        const telefoneInput = this.template.querySelector('[data-field="telefone"]');

        const nomeVal = nomeInput.value;
        const emailVal = emailInput.value;
        const empresaVal = empresaInput.value;
        const telefoneVal = telefoneInput.value;

        if (!nomeVal || !emailVal || !empresaVal || !telefoneVal) {
            this.showCustomToast('Por favor, preencha todos os campos.', 'error');
            return;
        }

        this.loading = true;
        this.buttonLabel = 'Enviando...';

        createLead({ 
            nome: nomeVal, 
            email: emailVal, 
            empresa: empresaVal, 
            telefone: telefoneVal 
        })
            .then(() => {
                this.showCustomToast('Sucesso! Em breve, entraremos em contato.', 'success');
                
                nomeInput.value = '';
                emailInput.value = '';
                empresaInput.value = '';
                telefoneInput.value = ''; 
            })
            .catch((error) => {
                console.error(error);
                this.showCustomToast('Erro ao enviar. Tente novamente.', 'error');
            })
            .finally(() => {
                this.loading = false;
                this.buttonLabel = 'Solicitar contato';
            });
    }

    showCustomToast(message, type) {
        this.notificationMessage = message;
        this.notificationType = type;
        this.showNotification = true;

        setTimeout(() => {
            this.showNotification = false;
        }, 4000);
    }

    closeNotification() {
        this.showNotification = false;
    }
}