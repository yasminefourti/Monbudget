<?php

namespace App\Tests\Entity;

use App\Entity\Transaction;
use App\Entity\User;
use App\Entity\Categorie;
use App\Entity\Objectif;
use PHPUnit\Framework\TestCase;
use DateTime;

class TransactionTest extends TestCase
{
    // ⭐ NIVEAU 1 : TESTS DE BASE (COMMENCEZ ICI)
    
    public function testTransactionCanBeCreated()
    {
        $transaction = new Transaction();
        
        $this->assertInstanceOf(Transaction::class, $transaction);
        $this->assertNull($transaction->getId());
    }
    
    public function testSetAndGetAmount()
    {
        $transaction = new Transaction();
        $transaction->setAmount(150.75);
        
        $this->assertEquals(150.75, $transaction->getAmount());
    }
    
    public function testSetAndGetType()
    {
        $transaction = new Transaction();
        
        // Test type dépense
        $transaction->setType('dépense');
        $this->assertEquals('dépense', $transaction->getType());
        
        // Test type recette
        $transaction->setType('recette');
        $this->assertEquals('recette', $transaction->getType());
    }
    
    public function testSetAndGetDescription()
    {
        $transaction = new Transaction();
        $transaction->setDescription('Courses supermarché');
        
        $this->assertEquals('Courses supermarché', $transaction->getDescription());
    }
    
    public function testDescriptionCanBeNull()
    {
        $transaction = new Transaction();
        $transaction->setDescription(null);
        
        $this->assertNull($transaction->getDescription());
    }
    
    // ⭐ NIVEAU 2 : TESTS DES DATES
    
    public function testSetAndGetDate()
    {
        $transaction = new Transaction();
        $date = new DateTime('2025-01-15');
        $transaction->setDate($date);
        
        $this->assertEquals($date, $transaction->getDate());
        $this->assertEquals('2025-01-15', $transaction->getDate()->format('Y-m-d'));
    }
    
    public function testDateCanBePast()
    {
        $transaction = new Transaction();
        $pastDate = new DateTime('2024-12-01');
        $transaction->setDate($pastDate);
        
        $this->assertEquals('2024-12-01', $transaction->getDate()->format('Y-m-d'));
    }
    
    public function testDateCanBeFuture()
    {
        $transaction = new Transaction();
        $futureDate = new DateTime('2025-12-31');
        $transaction->setDate($futureDate);
        
        $this->assertEquals('2025-12-31', $transaction->getDate()->format('Y-m-d'));
    }
    
    // ⭐ NIVEAU 3 : TESTS DES RELATIONS
    
    public function testSetAndGetUser()
    {
        $transaction = new Transaction();
        $user = new User();
        $transaction->setUser($user);
        
        $this->assertSame($user, $transaction->getUser());
    }
    
    public function testSetAndGetCategorie()
    {
        $transaction = new Transaction();
        $categorie = new Categorie();
        $transaction->setCategorie($categorie);
        
        $this->assertSame($categorie, $transaction->getCategorie());
    }
    
    public function testCategorieCanBeNull()
    {
        $transaction = new Transaction();
        $transaction->setCategorie(null);
        
        $this->assertNull($transaction->getCategorie());
    }
    
    public function testSetAndGetObjectif()
    {
        $transaction = new Transaction();
        $objectif = new Objectif();
        $transaction->setObjectif($objectif);
        
        $this->assertSame($objectif, $transaction->getObjectif());
    }
    
    // ⭐ NIVEAU 4 : TEST SCENARIO COMPLET
    
    public function testCompleteDepenseTransaction()
    {
        // Préparation des objets liés
        $user = new User();
        $categorie = new Categorie();
        $objectif = new Objectif();
        $date = new DateTime('2025-01-15');
        
        // Création de la transaction
        $transaction = new Transaction();
        $transaction->setType('dépense')
                   ->setAmount(85.50)
                   ->setDate($date)
                   ->setDescription('Restaurant italien')
                   ->setUser($user)
                   ->setCategorie($categorie)
                   ->setObjectif($objectif);
        
        // Vérifications
        $this->assertEquals('dépense', $transaction->getType());
        $this->assertEquals(85.50, $transaction->getAmount());
        $this->assertEquals($date, $transaction->getDate());
        $this->assertEquals('Restaurant italien', $transaction->getDescription());
        $this->assertSame($user, $transaction->getUser());
        $this->assertSame($categorie, $transaction->getCategorie());
        $this->assertSame($objectif, $transaction->getObjectif());
    }
    
    public function testCompleteRecetteTransaction()
    {
        // Préparation
        $user = new User();
        $objectif = new Objectif();
        $date = new DateTime('2025-01-01');
        
        // Transaction recette
        $transaction = new Transaction();
        $transaction->setType('recette')
                   ->setAmount(2500.00)
                   ->setDate($date)
                   ->setDescription('Salaire janvier')
                   ->setUser($user)
                   ->setObjectif($objectif);
                   // Pas de catégorie pour les recettes
        
        // Vérifications
        $this->assertEquals('recette', $transaction->getType());
        $this->assertEquals(2500.00, $transaction->getAmount());
        $this->assertEquals('Salaire janvier', $transaction->getDescription());
        $this->assertNull($transaction->getCategorie());
        $this->assertSame($user, $transaction->getUser());
        $this->assertSame($objectif, $transaction->getObjectif());
    }
    
    // ⭐ NIVEAU 5 : TESTS DE CAS LIMITES
    
    public function testSmallAmount()
    {
        $transaction = new Transaction();
        $transaction->setAmount(0.01);
        
        $this->assertEquals(0.01, $transaction->getAmount());
    }
    
    public function testLargeAmount()
    {
        $transaction = new Transaction();
        $transaction->setAmount(999999.99);
        
        $this->assertEquals(999999.99, $transaction->getAmount());
    }
    
    public function testLongDescription()
    {
        $transaction = new Transaction();
        $longDescription = str_repeat('A', 250); // Proche de la limite 255
        $transaction->setDescription($longDescription);
        
        $this->assertEquals($longDescription, $transaction->getDescription());
    }
}