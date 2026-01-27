public without sharing class PublicLeadController {
    @AuraEnabled
    public static void createLead(String nome, String email, String empresa, String telefone) {
        try {
            Lead newLead = new Lead();
            
            if (nome.contains(' ')) {
                newLead.FirstName = nome.substringBefore(' ');
                newLead.LastName = nome.substringAfter(' ');
            } else {
                newLead.LastName = nome;
            }
            
            newLead.Company = empresa;
            newLead.Email = email;
            newLead.Phone = telefone;
            newLead.LeadSource = 'Web Demo';
            
            insert newLead;
        } catch (Exception e) {
            throw new AuraHandledException('Erro ao criar lead: ' + e.getMessage());
        }
    }

    // --- NOVOS MÉTODOS PARA O DASHBOARD ---

    @AuraEnabled(cacheable=true)
    public static List<Lead> getRecentLeads() {
        return [
            SELECT Id, Name, Email, Company, Phone, CreatedDate, Status 
            FROM Lead 
            WHERE LeadSource = 'Web Demo' 
            ORDER BY CreatedDate DESC 
            LIMIT 10
        ];
    }
    
    @AuraEnabled(cacheable=true)
    public static Integer getLeadCount() {
        return [SELECT Count() FROM Lead WHERE LeadSource = 'Web Demo'];
    }
}