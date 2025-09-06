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
    
    //  1 TESTS DE SCÉNARIOS COMPLETS
    
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
    
   
    // 2 TESTS DE SCÉNARIOS RÉELS
    
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
}    
    