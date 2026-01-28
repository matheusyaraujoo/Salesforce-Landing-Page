import { LightningElement, wire, track } from 'lwc';
import getRecentLeads from '@salesforce/apex/PublicLeadController.getRecentLeads';
import getLeadCount from '@salesforce/apex/PublicLeadController.getLeadCount';
import getAccessCount from '@salesforce/apex/PublicLeadController.getAccessCount';

const COLUMNS = [
    { label: 'Nome', fieldName: 'Name' },
    { label: 'Empresa', fieldName: 'Company' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Telefone', fieldName: 'Phone', type: 'phone' },
    { label: 'Data', fieldName: 'CreatedDate', type: 'date', 
      typeAttributes: { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' } }
];

export default class LeadDashboard extends LightningElement {
    columns = COLUMNS;
    @track leads = [];
    @track totalLeads = 0;
    @track totalAccess = 0;

    @wire(getRecentLeads)
    wiredLeads({ error, data }) {
        if (data) {
            this.leads = data;
        } else if (error) {
            console.error('Erro ao buscar leads:', error);
        }
    }

    @wire(getLeadCount)
    wiredCount({ error, data }) {
        if (data) {
            this.totalLeads = data;
        } else if (error) {
            console.error('Erro ao contar:', error);
        }
    }

    @wire(getAccessCount)
    wiredAccess({ error, data }) {
        if (data) {
            this.totalAccess = data;
        } else if (error) {
            console.error(error);
        }
    }

    get conversionRate() {
        if (this.totalAccess === 0) return '0%';
        const rate = (this.totalLeads / this.totalAccess) * 100;
        return rate.toFixed(1) + '%';
    }
}




