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

    // --- NOVOS MÉTODOS DE ACESSO ---

    // 1. Registra que alguém entrou no site (FILTRADO PARA GUESTS APENAS)
    @AuraEnabled
    public static void registerAccess() {
        if (UserInfo.getUserType() == 'Guest') {
            try {
                Site_Access__c newAccess = new Site_Access__c();
                insert newAccess;
            } catch (Exception e) {
                System.debug('Erro ao registrar acesso: ' + e.getMessage());
            }
        }
    }

    // 2. Conta total de visitas
    @AuraEnabled(cacheable=true)
    public static Integer getAccessCount() {
        return [SELECT Count() FROM Site_Access__c];
    }

    // --- MÉTODOS PARA O DASHBOARD ---

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