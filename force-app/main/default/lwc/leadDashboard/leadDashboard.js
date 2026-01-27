import { LightningElement, wire, track } from 'lwc';
import getRecentLeads from '@salesforce/apex/PublicLeadController.getRecentLeads';
import getLeadCount from '@salesforce/apex/PublicLeadController.getLeadCount';

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
}