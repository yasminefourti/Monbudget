POST   http://127.0.0.1:8000/api/register
POST   http://127.0.0.1:8000/api/login
GET    http://localhost:8000/api/user/profile  **user Consulter son profil** 
 PUT   http://127.0.0.1:8000/api/user/profile  **user Modifier ses informations**
GET    http://localhost:8000/api/users **admin lister  tous les utilisateurs**
 PUT   http://localhost:8000/api/admin/users/2 **admin modifier role** 
DELETE http://localhost:8000/api/admin/users/2 **admin supprimer un utilisateur** 
DELETE http://localhost:8000/api/admin/users/2?type=hard  **Suppression définitive par admin** 
POST   http://localhost:8000/api/logout  **logout**
Post   http://localhost:8000/api/budget/goals **creer objectif** 
GET    http://localhost:8000/api/budget/goals  **lister objectifs**
DELETE http://localhost:8000/api/budget/goals/{id} **supprimer objectif** 
PUT    http://localhost:8000/api/budget/goals/2 **mettre a jour objectif**
GET    http://localhost:8000/api/budget/goals/{goalId}/transactions  Lister les transactions d’un objectif
POST   http://localhost:8000/api/budget/goals/{goalId}/transactions  Créer une transaction pour un objectif
GET    http://localhost:8000/api/budget/transactions/{Id} Voir le détail d’une transaction
PUT    http://localhost:8000/api/budget/transactions/{Id}  Modifier une transaction
DELETE http://localhost:8000/api/budget/transactions/{Id}  Supprimer une transaction
POST   http://localhost:8000/api/budget/categories   Création d’une catégorie
GET    http://localhost:8000/api/budget/categories  Récupèrer la liste des catégories disponibles
PUT    http://localhost:8000/api/budget/categories/1   Mettre à jour une catégorie
DELETE http://localhost:8000/api/budget/categories/1 Supprime une catégorie
GET     /api/budget/dashboard - Vue globale
GET     /api/budget/goals/{id}/progress - Progression d'un objectif