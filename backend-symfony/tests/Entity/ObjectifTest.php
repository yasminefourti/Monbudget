<?php

namespace App\Tests\Entity;

use App\Entity\Objectif;
use App\Entity\User;
use App\Entity\Transaction;
use PHPUnit\Framework\TestCase;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;

class ObjectifTest extends TestCase
{
    // ⭐ NIVEAU 1 : TESTS DE BASE
    
    public function testObjectifCanBeCreated()
    {
        $objectif = new Objectif();
        
        $this->assertInstanceOf(Objectif::class, $objectif);
        $this->assertNull($objectif->getId());
        $this->assertEquals(0.0, $objectif->getCurrentAmount()); // Valeur par défaut
        $this->assertInstanceOf(ArrayCollection::class, $objectif->getTransactions());
        $this->assertCount(0, $objectif->getTransactions()); // Collection vide au début
    }
    
    public function testSetAndGetTitle()
    {
        $objectif = new Objectif();
        $objectif->setTitle('Épargne vacances');
        
        $this->assertEquals('Épargne vacances', $objectif->getTitle());
    }
    
    public function testSetAndGetTargetAmount()
    {
        $objectif = new Objectif();
        $objectif->setTargetAmount(5000.0);
        
        $this->assertEquals(5000.0, $objectif->getTargetAmount());
    }
    
    public function testSetAndGetCurrentAmount()
    {
        $objectif = new Objectif();
        $objectif->setCurrentAmount(1250.50);
        
        $this->assertEquals(1250.50, $objectif->getCurrentAmount());
    }
    
    // ⭐ NIVEAU 2 : TESTS DES DATES
    
    public function testSetAndGetStartDate()
    {
        $objectif = new Objectif();
        $startDate = new DateTime('2025-01-01');
        $objectif->setStartDate($startDate);
        
        $this->assertEquals($startDate, $objectif->getStartDate());
        $this->assertEquals('2025-01-01', $objectif->getStartDate()->format('Y-m-d'));
    }
    
    public function testSetAndGetEndDate()
    {
        $objectif = new Objectif();
        $endDate = new DateTime('2025-12-31');
        $objectif->setEndDate($endDate);
        
        $this->assertEquals($endDate, $objectif->getEndDate());
        $this->assertEquals('2025-12-31', $objectif->getEndDate()->format('Y-m-d'));
    }
    
    public function testValidDateRange()
    {
        $objectif = new Objectif();
        $startDate = new DateTime('2025-01-01');
        $endDate = new DateTime('2025-12-31');
        
        $objectif->setStartDate($startDate)
                 ->setEndDate($endDate);
        
        $this->assertTrue($objectif->getEndDate() > $objectif->getStartDate());
    }
    
    // ⭐ NIVEAU 3 : TESTS DES RELATIONS
    
    public function testSetAndGetUser()
    {
        $objectif = new Objectif();
        $user = new User();
        $objectif->setUser($user);
        
        $this->assertSame($user, $objectif->getUser());
    }
    
    public function testAddTransaction()
    {
        $objectif = new Objectif();
        $transaction = new Transaction();
        
        $objectif->addTransaction($transaction);
        
        $this->assertCount(1, $objectif->getTransactions());
        $this->assertTrue($objectif->getTransactions()->contains($transaction));
        $this->assertSame($objectif, $transaction->getObjectif()); // Relation bidirectionnelle
    }
    
    public function testAddSameTransactionTwice()
    {
        $objectif = new Objectif();
        $transaction = new Transaction();
        
        $objectif->addTransaction($transaction);
        $objectif->addTransaction($transaction); // Même transaction
        
        $this->assertCount(1, $objectif->getTransactions()); // Pas de doublon
    }
    
    public function testRemoveTransaction()
    {
        $objectif = new Objectif();
        $transaction = new Transaction();
        
        // Ajouter puis retirer
        $objectif->addTransaction($transaction);
        $this->assertCount(1, $objectif->getTransactions());
        
        $objectif->removeTransaction($transaction);
        $this->assertCount(0, $objectif->getTransactions());
        $this->assertNull($transaction->getObjectif()); // Relation cassée
    }
    
    public function testRemoveNonExistentTransaction()
    {
        $objectif = new Objectif();
        $transaction1 = new Transaction();
        $transaction2 = new Transaction();
        
        $objectif->addTransaction($transaction1);
        $objectif->removeTransaction($transaction2); // Transaction pas dans la collection
        
        $this->assertCount(1, $objectif->getTransactions()); // Aucun changement
        $this->assertTrue($objectif->getTransactions()->contains($transaction1));
    }
    
    // ⭐ NIVEAU 4 : TESTS DE SCÉNARIOS COMPLETS
    
    public function testObjectifEpargneComplet()
    {
        $user = new User();
        $startDate = new DateTime('2025-01-01');
        $endDate = new DateTime('2025-06-30');
        
        $objectif = new Objectif();
        $objectif->setTitle('Épargne vacances été 2025')
                 ->setTargetAmount(3000.0)
                 ->setCurrentAmount(450.0)
                 ->setStartDate($startDate)
                 ->setEndDate($endDate)
                 ->setUser($user);
        
        // Vérifications
        $this->assertEquals('Épargne vacances été 2025', $objectif->getTitle());
        $this->assertEquals(3000.0, $objectif->getTargetAmount());
        $this->assertEquals(450.0, $objectif->getCurrentAmount());
        $this->assertEquals($startDate, $objectif->getStartDate());
        $this->assertEquals($endDate, $objectif->getEndDate());
        $this->assertSame($user, $objectif->getUser());
        $this->assertTrue($objectif->getEndDate() > $objectif->getStartDate());
    }
    
    public function testObjectifAvecPlusieursTransactions()
    {
        $objectif = new Objectif();
        $objectif->setTitle('Budget mensuel')
                 ->setTargetAmount(2000.0);
        
        // Ajout de plusieurs transactions
        $transaction1 = new Transaction();
        $transaction1->setAmount(500.0)->setType('recette');
        
        $transaction2 = new Transaction();
        $transaction2->setAmount(150.0)->setType('dépense');
        
        $transaction3 = new Transaction();
        $transaction3->setAmount(1000.0)->setType('recette');
        
        $objectif->addTransaction($transaction1)
                 ->addTransaction($transaction2)
                 ->addTransaction($transaction3);
        
        $this->assertCount(3, $objectif->getTransactions());
        
        // Vérifier que toutes les transactions pointent vers cet objectif
        foreach ($objectif->getTransactions() as $transaction) {
            $this->assertSame($objectif, $transaction->getObjectif());
        }
    }
    
    // ⭐ NIVEAU 5 : TESTS MÉTIER AVANCÉS
    
    public function testObjectifCourtTerme()
    {
        $objectif = new Objectif();
        $startDate = new DateTime('2025-02-01');
        $endDate = new DateTime('2025-02-28'); // 1 mois
        
        $objectif->setTitle('Objectif mensuel')
                 ->setTargetAmount(1500.0)
                 ->setStartDate($startDate)
                 ->setEndDate($endDate);
        
        $this->assertEquals('Objectif mensuel', $objectif->getTitle());
        
        // Vérifier que c'est bien un objectif court terme (moins de 3 mois)
        $interval = $startDate->diff($endDate);
        $this->assertLessThan(90, $interval->days);
    }
    
    public function testObjectifLongTerme()
    {
        $objectif = new Objectif();
        $startDate = new DateTime('2025-01-01');
        $endDate = new DateTime('2026-01-01'); // 1 an
        
        $objectif->setTitle('Épargne maison')
                 ->setTargetAmount(50000.0)
                 ->setStartDate($startDate)
                 ->setEndDate($endDate);
        
        // Vérifier que c'est bien un objectif long terme
        $interval = $startDate->diff($endDate);
        $this->assertGreaterThan(300, $interval->days);
    }
    
    // ⭐ NIVEAU 6 : TESTS DE CAS LIMITES
    
    public function testObjectifAvecMontantCibleElevee()
    {
        $objectif = new Objectif();
        $objectif->setTargetAmount(999999.99);
        
        $this->assertEquals(999999.99, $objectif->getTargetAmount());
    }
    
    public function testObjectifAvecMontantCibleFaible()
    {
        $objectif = new Objectif();
        $objectif->setTargetAmount(1.0);
        
        $this->assertEquals(1.0, $objectif->getTargetAmount());
    }
    
    public function testTitreLong()
    {
        $objectif = new Objectif();
        $longTitle = str_repeat('A', 250); // Proche limite 255
        $objectif->setTitle($longTitle);
        
        $this->assertEquals($longTitle, $objectif->getTitle());
    }
    
    public function testCurrentAmountZero()
    {
        $objectif = new Objectif();
        $objectif->setCurrentAmount(0.0);
        
        $this->assertEquals(0.0, $objectif->getCurrentAmount());
    }
    
    // ⭐ NIVEAU 7 : TESTS DE MÉTHODES FLUIDES
    
    public function testFluentInterface()
    {
        $user = new User();
        $startDate = new DateTime('2025-03-01');
        $endDate = new DateTime('2025-09-01');
        
        $objectif = new Objectif();
        
        $result = $objectif->setTitle('Test fluent')
                          ->setTargetAmount(2000.0)
                          ->setCurrentAmount(250.0)
                          ->setStartDate($startDate)
                          ->setEndDate($endDate)
                          ->setUser($user);
        
        // Vérifier que le chaînage retourne bien l'instance
        $this->assertSame($objectif, $result);
        
        // Vérifier toutes les valeurs
        $this->assertEquals('Test fluent', $objectif->getTitle());
        $this->assertEquals(2000.0, $objectif->getTargetAmount());
        $this->assertEquals(250.0, $objectif->getCurrentAmount());
        $this->assertEquals($startDate, $objectif->getStartDate());
        $this->assertEquals($endDate, $objectif->getEndDate());
        $this->assertSame($user, $objectif->getUser());
    }
    
    // ⭐ NIVEAU 8 : TESTS DE COLLECTION AVANCÉS
    
    public function testMultipleTransactionsManagement()
    {
        $objectif = new Objectif();
        
        // Créer plusieurs transactions
        $transactions = [];
        for ($i = 1; $i <= 5; $i++) {
            $transaction = new Transaction();
            $transaction->setAmount($i * 100);
            $transactions[] = $transaction;
            $objectif->addTransaction($transaction);
        }
        
        $this->assertCount(5, $objectif->getTransactions());
        
        // Retirer une transaction du milieu
        $objectif->removeTransaction($transactions[2]); // 3ème transaction
        
        $this->assertCount(4, $objectif->getTransactions());
        $this->assertFalse($objectif->getTransactions()->contains($transactions[2]));
        $this->assertNull($transactions[2]->getObjectif());
    }
    
    public function testClearAllTransactions()
    {
        $objectif = new Objectif();
        
        // Ajouter plusieurs transactions
        for ($i = 1; $i <= 3; $i++) {
            $transaction = new Transaction();
            $objectif->addTransaction($transaction);
        }
        
        $this->assertCount(3, $objectif->getTransactions());
        
        // Retirer toutes les transactions une par une
        $transactionsToRemove = $objectif->getTransactions()->toArray();
        foreach ($transactionsToRemove as $transaction) {
            $objectif->removeTransaction($transaction);
        }
        
        $this->assertCount(0, $objectif->getTransactions());
    }
    
    // ⭐ NIVEAU 9 : TESTS DE SCÉNARIOS RÉELS
    
    public function testObjectifVacancesRealistic()
    {
        $user = new User();
        $objectif = new Objectif();
        
        $objectif->setTitle('Vacances en Grèce - Été 2025')
                 ->setTargetAmount(2500.0)
                 ->setCurrentAmount(0.0)
                 ->setStartDate(new DateTime('2025-01-01'))
                 ->setEndDate(new DateTime('2025-07-01'))
                 ->setUser($user);
        
        // Simulation d'épargne mensuelle
        $epargnesMensuelles = [300, 400, 350, 400, 300]; // 5 mois
        $totalEpargne = 0;
        
        foreach ($epargnesMensuelles as $montant) {
            $transaction = new Transaction();
            $transaction->setAmount($montant)
                       ->setType('recette')
                       ->setDescription('Épargne mensuelle');
            
            $objectif->addTransaction($transaction);
            $totalEpargne += $montant;
        }
        
        $this->assertCount(5, $objectif->getTransactions());
        $this->assertEquals(1750, $totalEpargne); // 300+400+350+400+300
        
        // Mettre à jour le montant courant
        $objectif->setCurrentAmount($totalEpargne);
        $this->assertEquals(1750.0, $objectif->getCurrentAmount());
    }
    
    public function testObjectifAchatVoiture()
    {
        $user = new User();
        
        $objectif = new Objectif();
        $objectif->setTitle('Achat voiture neuve')
                 ->setTargetAmount(25000.0)
                 ->setCurrentAmount(5000.0) // Apport initial
                 ->setStartDate(new DateTime('2025-01-01'))
                 ->setEndDate(new DateTime('2027-01-01')) // 2 ans
                 ->setUser($user);
        
        // Vérifications
        $this->assertEquals('Achat voiture neuve', $objectif->getTitle());
        $this->assertEquals(25000.0, $objectif->getTargetAmount());
        $this->assertEquals(5000.0, $objectif->getCurrentAmount());
        
        // Calculer le reste à épargner
        $resteAEpargner = $objectif->getTargetAmount() - $objectif->getCurrentAmount();
        $this->assertEquals(20000.0, $resteAEpargner);
        
        // Vérifier la durée (2 ans)
        $interval = $objectif->getStartDate()->diff($objectif->getEndDate());
        $this->assertEquals(2, $interval->y);
    }
    
    // ⭐ NIVEAU 10 : TESTS DE PÉRIODES ET DURÉES
    
    public function testObjectifDureeEnJours()
    {
        $objectif = new Objectif();
        $startDate = new DateTime('2025-01-01');
        $endDate = new DateTime('2025-01-31'); // 30 jours
        
        $objectif->setStartDate($startDate)
                 ->setEndDate($endDate);
        
        $interval = $startDate->diff($endDate);
        $this->assertEquals(30, $interval->days);
    }
    
    public function testObjectifDureeEnMois()
    {
        $objectif = new Objectif();
        $startDate = new DateTime('2025-01-01');
        $endDate = new DateTime('2025-07-01'); // 6 mois
        
        $objectif->setStartDate($startDate)
                 ->setEndDate($endDate);
        
        $interval = $startDate->diff($endDate);
        $this->assertEquals(6, $interval->m);
    }
    
    public function testObjectifDureeEnAnnees()
    {
        $objectif = new Objectif();
        $startDate = new DateTime('2025-01-01');
        $endDate = new DateTime('2030-01-01'); // 5 ans
        
        $objectif->setStartDate($startDate)
                 ->setEndDate($endDate);
        
        $interval = $startDate->diff($endDate);
        $this->assertEquals(5, $interval->y);
    }
    
    // ⭐ NIVEAU 11 : TESTS DE CAS SPÉCIAUX
    
    public function testObjectifAvecCurrentAmountEgalTarget()
    {
        $objectif = new Objectif();
        $objectif->setTargetAmount(1000.0)
                 ->setCurrentAmount(1000.0); // Objectif atteint !
        
        $this->assertEquals($objectif->getTargetAmount(), $objectif->getCurrentAmount());
    }
    
    public function testObjectifAvecCurrentAmountSuperieurTarget()
    {
        $objectif = new Objectif();
        $objectif->setTargetAmount(1000.0)
                 ->setCurrentAmount(1200.0); // Dépassement !
        
        $this->assertGreaterThan($objectif->getTargetAmount(), $objectif->getCurrentAmount());
    }
    
    public function testObjectifDateDebutAujourdhui()
    {
        $objectif = new Objectif();
        $today = new DateTime();
        $futureDate = new DateTime('+6 months');
        
        $objectif->setStartDate($today)
                 ->setEndDate($futureDate);
        
        $this->assertEquals($today->format('Y-m-d'), $objectif->getStartDate()->format('Y-m-d'));
    }
}