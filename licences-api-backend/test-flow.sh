#!/bin/bash

# Script de test du flow complet API Licences
# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000/api"
SESSION_COOKIE="" # sera initialisé lors du premier appel /cart

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🧪 Test Flow Complet API Licences${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Admin credentials
ADMIN_EMAIL="abdulkabore@gmail.com"
ADMIN_PASSWORD="abdulkabore@gmail.com1@T"
ADMIN_TOKEN=""
CATEGORY_ID=""
PRODUCT_ID=""
PRODUCT_ID_2=""
ORDER_ID=""
ORDER_NUMBER=""
TIMESTAMP=$(date +%s)

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
        echo -e "${RED}Détails: $3${NC}"
    fi
}

# Fonction pour extraire une valeur JSON (racine uniquement, avant tout objet imbriqué)
extract_json() {
    # Extrait la première occurrence du champ au niveau racine
    # En s'arrêtant avant les objets/arrays imbriqués (marqués par { ou [)
    echo "$1" | grep -o "\"$2\":\"[^\"]*\"" | head -n1 | cut -d'"' -f4 | tr -d '\r\n'
}

extract_json_number() {
    echo "$1" | grep -o "\"$2\":[0-9]*" | head -n1 | cut -d':' -f2
}

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📋 PHASE 1: SANTÉ DE L'API${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Test 1: Health check
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/health")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    print_result 0 "Health check"
else
    print_result 1 "Health check" "HTTP $HTTP_CODE"
    exit 1
fi

echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🔐 PHASE 2: AUTHENTIFICATION ADMIN${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Test 2: Login admin
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    ADMIN_TOKEN=$(extract_json "$BODY" "accessToken")
    if [ -n "$ADMIN_TOKEN" ]; then
        print_result 0 "Login admin"
        echo -e "   ${BLUE}Token: ${ADMIN_TOKEN:0:20}...${NC}"
    else
        print_result 1 "Login admin" "Token non trouvé"
        exit 1
    fi
else
    print_result 1 "Login admin" "HTTP $HTTP_CODE - $BODY"
    exit 1
fi

# Test 3: Get current admin info
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/auth/me" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    print_result 0 "Récupération profil admin"
    EMAIL=$(extract_json "$BODY" "email")
    echo -e "   ${BLUE}Email: $EMAIL${NC}"
else
    print_result 1 "Récupération profil admin" "HTTP $HTTP_CODE"
fi

echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📁 PHASE 3: GESTION DES CATÉGORIES${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Test 4: Créer une catégorie
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/categories" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Licences Windows Test $TIMESTAMP\",
    \"description\": \"Catégorie de test pour Windows\",
    \"isActive\": true
  }")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    CATEGORY_ID=$(extract_json "$BODY" "id")
    CATEGORY_ID=$(echo "$CATEGORY_ID" | tr -d '\r\n')
    print_result 0 "Création catégorie"
    echo -e "   ${BLUE}ID: $CATEGORY_ID${NC}"
else
    print_result 1 "Création catégorie" "HTTP $HTTP_CODE - $BODY"
fi

# Test 5: Lister les catégories (public)
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/categories")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "200" ]; then
    print_result 0 "Liste catégories (public)"
else
    print_result 1 "Liste catégories (public)" "HTTP $HTTP_CODE"
fi

# Test 6: Récupérer la catégorie par ID
if [ -n "$CATEGORY_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/categories/$CATEGORY_ID")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_result 0 "Récupération catégorie par ID"
    else
        print_result 1 "Récupération catégorie par ID" "HTTP $HTTP_CODE"
    fi
fi

echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🛍️  PHASE 4: GESTION DES PRODUITS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Test 7: Créer un produit
if [ -n "$CATEGORY_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/products" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"name\": \"Windows 11 Pro Test $TIMESTAMP\",
        \"description\": \"Licence Windows 11 Pro pour test\",
        \"shortDescription\": \"Win 11 Pro\",
        \"price\": 89.99,
        \"comparePrice\": 129.99,
        \"stockQuantity\": 50,
        \"categoryId\": \"$CATEGORY_ID\",
        \"image\": \"https://example.com/win11.jpg\",
        \"isActive\": true,
        \"isFeatured\": true,
        \"tags\": [\"windows\", \"pro\", \"test\"]
      }")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
        PRODUCT_ID=$(extract_json "$BODY" "id")
        PRODUCT_ID=$(echo "$PRODUCT_ID" | tr -d '\r\n' | awk '{$1=$1};1')
        print_result 0 "Création produit 1"
        echo -e "   ${BLUE}ID: $PRODUCT_ID${NC}"
    else
        print_result 1 "Création produit 1" "HTTP $HTTP_CODE - $BODY"
    fi
fi

# Test 8: Créer un deuxième produit
if [ -n "$CATEGORY_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/products" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"name\": \"Office 2021 Pro Test $TIMESTAMP\",
        \"description\": \"Microsoft Office 2021 Pro pour test\",
        \"shortDescription\": \"Office Pro\",
        \"price\": 59.99,
        \"stockQuantity\": 100,
        \"categoryId\": \"$CATEGORY_ID\",
        \"isActive\": true
      }")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
        PRODUCT_ID_2=$(extract_json "$BODY" "id")
        PRODUCT_ID_2=$(echo "$PRODUCT_ID_2" | tr -d '\r\n' | awk '{$1=$1};1')
        print_result 0 "Création produit 2"
        echo -e "   ${BLUE}ID: $PRODUCT_ID_2${NC}"
    else
        print_result 1 "Création produit 2" "HTTP $HTTP_CODE - $BODY"
    fi
fi

# Test 9: Lister les produits (public)
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/products")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "200" ]; then
    print_result 0 "Liste produits (public)"
else
    print_result 1 "Liste produits (public)" "HTTP $HTTP_CODE"
fi

# Test 9b: Pagination - limit=1 page=1
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/products?limit=1&page=1")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')
if [ "$HTTP_CODE" = "200" ] && echo "$BODY" | grep -q '"items"' ; then
    print_result 0 "Pagination produits limit=1 page=1"
else
    print_result 1 "Pagination produits" "HTTP $HTTP_CODE - $BODY"
fi

# Test 9c: Trier par prix asc
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/products?limit=5&sort=price&order=asc")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
if [ "$HTTP_CODE" = "200" ]; then
    print_result 0 "Tri produits par prix ASC"
else
    print_result 1 "Tri produits" "HTTP $HTTP_CODE"
fi

# Test 9d: Filtrer par fourchette de prix
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/products?minPrice=10&maxPrice=100")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
if [ "$HTTP_CODE" = "200" ]; then
    print_result 0 "Filtrer produits par prix (10-100)"
else
    print_result 1 "Filtrer produits" "HTTP $HTTP_CODE"
fi

# Test 9e: Filtrer par catégorie
if [ -n "$CATEGORY_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/products?categoryId=$CATEGORY_ID")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    if [ "$HTTP_CODE" = "200" ]; then
        print_result 0 "Filtrer produits par catégorie"
    else
        print_result 1 "Filtrer produits par catégorie" "HTTP $HTTP_CODE"
    fi
fi

# Test 9f: Recherche (q)
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/products?q=Test")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
if [ "$HTTP_CODE" = "200" ]; then
    print_result 0 "Recherche produits (q=Test)"
else
    print_result 1 "Recherche produits" "HTTP $HTTP_CODE"
fi

# Test 10: Récupérer un produit par ID
if [ -n "$PRODUCT_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/products/$PRODUCT_ID")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_result 0 "Récupération produit par ID"
    else
        print_result 1 "Récupération produit par ID" "HTTP $HTTP_CODE - ProductID: $PRODUCT_ID"
    fi
fi

echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🛒 PHASE 5: GESTION DU PANIER (CLIENT)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Test 11: Récupérer panier vide (et capturer cookie de session)
TMP_RESPONSE_HEADERS=$(mktemp)
BODY_CART=$(curl -s -D "$TMP_RESPONSE_HEADERS" -o /dev/null "$API_URL/cart")
HTTP_CODE=$(grep -i "HTTP/" "$TMP_RESPONSE_HEADERS" | tail -n1 | awk '{print $2}')
SESSION_COOKIE=$(grep -i "Set-Cookie: sessionId" "$TMP_RESPONSE_HEADERS" | head -n1 | sed 's/Set-Cookie: //' | cut -d';' -f1)
rm "$TMP_RESPONSE_HEADERS"

if [ "$HTTP_CODE" = "200" ] && [ -n "$SESSION_COOKIE" ]; then
    print_result 0 "Récupération panier vide"
else
    print_result 1 "Récupération panier vide" "HTTP $HTTP_CODE / Cookie: $SESSION_COOKIE"
fi

# Test 12: Ajouter produit 1 au panier
if [ -n "$PRODUCT_ID" ]; then
    CLEAN_PID=$(echo -n "$PRODUCT_ID" | tr -d '\r\n')
    JSON_PAYLOAD=$(printf '{"productId":"%s","quantity":%d}' "$CLEAN_PID" 2)
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/cart/items" \
                -H "Cookie: $SESSION_COOKIE" \
                -H "Content-Type: application/json" \
                -d "$JSON_PAYLOAD")
            HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
            BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
        print_result 0 "Ajout produit 1 au panier (qté: 2)"
    else
        print_result 1 "Ajout produit 1 au panier" "HTTP $HTTP_CODE - $BODY"
    fi
fi

# Test 13: Ajouter produit 2 au panier
if [ -n "$PRODUCT_ID_2" ]; then
    CLEAN_PID2=$(echo -n "$PRODUCT_ID_2" | tr -d '\r\n')
    JSON_PAYLOAD2=$(printf '{"productId":"%s","quantity":%d}' "$CLEAN_PID2" 1)
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/cart/items" \
                -H "Cookie: $SESSION_COOKIE" \
                -H "Content-Type: application/json" \
                -d "$JSON_PAYLOAD2")
            HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
            BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
        print_result 0 "Ajout produit 2 au panier (qté: 1)"
    else
        print_result 1 "Ajout produit 2 au panier" "HTTP $HTTP_CODE"
    fi
fi

# Test 14: Récupérer panier avec articles
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/cart" \
    -H "Cookie: $SESSION_COOKIE")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    TOTAL_ITEMS=$(extract_json_number "$BODY" "totalItems")
    print_result 0 "Récupération panier avec articles"
    echo -e "   ${BLUE}Total articles: $TOTAL_ITEMS${NC}"
else
    print_result 1 "Récupération panier avec articles" "HTTP $HTTP_CODE"
fi

echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📦 PHASE 6: GESTION DES COMMANDES${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Test 15: Créer une commande depuis le panier
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/orders" \
    -H "Cookie: $SESSION_COOKIE" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Jean Dupont",
    "customerEmail": "jean.dupont@test.com",
    "customerPhone": "+33612345678"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    ORDER_ID=$(extract_json "$BODY" "id")
    ORDER_NUMBER=$(extract_json "$BODY" "orderNumber")
    WHATSAPP_URL=$(extract_json "$BODY" "whatsappUrl")
    print_result 0 "Création commande depuis panier"
    echo -e "   ${BLUE}ID: $ORDER_ID${NC}"
    echo -e "   ${BLUE}Numéro: $ORDER_NUMBER${NC}"
    if [ -n "$WHATSAPP_URL" ]; then
        echo -e "   ${GREEN}✓ WhatsApp URL générée${NC}"
        echo -e "   ${BLUE}URL: ${WHATSAPP_URL:0:60}...${NC}"
    fi
else
    print_result 1 "Création commande depuis panier" "HTTP $HTTP_CODE - $BODY"
fi

# Test 16: Vérifier que le panier est vide après commande
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/cart" \
    -H "Cookie: $SESSION_COOKIE")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    TOTAL_ITEMS=$(extract_json_number "$BODY" "totalItems")
    if [ "$TOTAL_ITEMS" = "0" ] || [ -z "$TOTAL_ITEMS" ]; then
        print_result 0 "Panier vidé après commande"
    else
        print_result 1 "Panier vidé après commande" "Total items: $TOTAL_ITEMS"
    fi
else
    print_result 1 "Vérification panier vide" "HTTP $HTTP_CODE"
fi

# Test 17: Récupérer la commande par ID (public)
if [ -n "$ORDER_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/orders/$ORDER_ID")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_result 0 "Récupération commande par ID (public)"
    else
        print_result 1 "Récupération commande par ID" "HTTP $HTTP_CODE"
    fi
fi

# Test 18: Récupérer la commande par numéro (public)
if [ -n "$ORDER_NUMBER" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/orders/number/$ORDER_NUMBER")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_result 0 "Récupération commande par numéro (public)"
    else
        print_result 1 "Récupération commande par numéro" "HTTP $HTTP_CODE"
    fi
fi

# Test 19: Lister toutes les commandes (admin)
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/orders" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "200" ]; then
    print_result 0 "Liste commandes (admin)"
else
    print_result 1 "Liste commandes (admin)" "HTTP $HTTP_CODE"
fi

# Test 20: Mettre à jour le statut de la commande (admin)
if [ -n "$ORDER_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$API_URL/orders/$ORDER_ID/status" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"status":"CONFIRMED"}')
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_result 0 "Mise à jour statut commande (CONFIRMED)"
    else
        print_result 1 "Mise à jour statut commande" "HTTP $HTTP_CODE"
    fi
fi

echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🔒 PHASE 7: TESTS DE SÉCURITÉ${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Test 21: Tentative de création catégorie sans token
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/categories" \
  -H "Content-Type: application/json" \
  -d '{"name":"Unauthorized Test"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "401" ]; then
    print_result 0 "Blocage création catégorie sans auth"
else
    print_result 1 "Blocage création catégorie sans auth" "HTTP $HTTP_CODE (attendu: 401)"
fi

# Test 22: Tentative de création produit sans token
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Unauthorized Product"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "401" ]; then
    print_result 0 "Blocage création produit sans auth"
else
    print_result 1 "Blocage création produit sans auth" "HTTP $HTTP_CODE (attendu: 401)"
fi

# Test 23: Tentative de liste commandes sans token
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/orders")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "401" ]; then
    print_result 0 "Blocage liste commandes sans auth"
else
    print_result 1 "Blocage liste commandes sans auth" "HTTP $HTTP_CODE (attendu: 401)"
fi

echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🧹 PHASE 8: NETTOYAGE (OPTIONNEL)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Test 24: Supprimer le produit 1
if [ -n "$PRODUCT_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/products/$PRODUCT_ID" \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_result 0 "Suppression produit 1"
    else
        print_result 1 "Suppression produit 1" "HTTP $HTTP_CODE - ID: $PRODUCT_ID"
    fi
fi

# Test 24b: Restaurer le produit 1
if [ -n "$PRODUCT_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$API_URL/products/$PRODUCT_ID/restore" \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ]; then
        print_result 0 "Restauration produit 1"
    else
        print_result 1 "Restauration produit 1" "HTTP $HTTP_CODE - ID: $PRODUCT_ID"
    fi
fi

# Test 25: Supprimer le produit 2
if [ -n "$PRODUCT_ID_2" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/products/$PRODUCT_ID_2" \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_result 0 "Suppression produit 2"
    else
        print_result 1 "Suppression produit 2" "HTTP $HTTP_CODE - ID: $PRODUCT_ID_2"
    fi
fi

# Test 25b: Restaurer le produit 2
if [ -n "$PRODUCT_ID_2" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$API_URL/products/$PRODUCT_ID_2/restore" \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ]; then
        print_result 0 "Restauration produit 2"
    else
        print_result 1 "Restauration produit 2" "HTTP $HTTP_CODE - ID: $PRODUCT_ID_2"
    fi
fi

# Test 26: Supprimer la catégorie
if [ -n "$CATEGORY_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/categories/$CATEGORY_ID" \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_result 0 "Suppression catégorie"
    else
        print_result 1 "Suppression catégorie" "HTTP $HTTP_CODE"
    fi
fi

# Test 26b: Restaurer la catégorie
if [ -n "$CATEGORY_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$API_URL/categories/$CATEGORY_ID/restore" \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ]; then
        print_result 0 "Restauration catégorie"
    else
        print_result 1 "Restauration catégorie" "HTTP $HTTP_CODE - ID: $CATEGORY_ID"
    fi
fi

echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🌐 PHASE 9: TESTS DE LOCALISATION (FR / EN)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Helper: perform localization check for a language
test_localization() {
    LANG=$1
    echo -e "   ${BLUE}-- Testing language: $LANG${NC}"
    TMP_HEADERS=$(mktemp)
    # Create a new session explicitly to isolate tests
    curl -s -D "$TMP_HEADERS" -o /dev/null -H "x-lang: $LANG" "$API_URL/cart"
    LANG_COOKIE=$(grep -i "Set-Cookie: sessionId" "$TMP_HEADERS" | head -n1 | sed 's/Set-Cookie: //' | cut -d';' -f1)
    rm "$TMP_HEADERS"

    if [ -z "$LANG_COOKIE" ]; then
        echo -e "   ${RED}✗ Could not create session for lang $LANG${NC}"
        return 1
    fi

    # Test: Create order with empty cart -> expect translated empty cart message
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/orders" \
        -H "x-lang: $LANG" \
        -H "Cookie: $LANG_COOKIE" \
        -H "Content-Type: application/json" \
        -d '{"customerName":"Jean Test","customerEmail":"test@test.com","customerPhone":"+33600000000"}')
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    MSG=$(extract_json "$BODY" "message")
    if [ "$HTTP_CODE" = "404" ] && [ -n "$MSG" ]; then
        echo -e "   ${GREEN}✓ Empty cart message for $LANG: $MSG${NC}"
    else
        echo -e "   ${RED}✗ Empty cart localization failed for $LANG - HTTP $HTTP_CODE - $MSG${NC}"
    fi

    # Test: Add invalid product to cart -> expect product not found
    BAD_ID="00000000-0000-0000-0000-000000000000"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/cart/items" \
        -H "x-lang: $LANG" \
        -H "Cookie: $LANG_COOKIE" \
        -H "Content-Type: application/json" \
        -d '{"productId":"'$BAD_ID'","quantity":1}')
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    MSG=$(extract_json "$BODY" "message")
    if [ "$HTTP_CODE" = "404" ] && echo "$MSG" | grep -Eiq "product|produit"; then
        echo -e "   ${GREEN}✓ Invalid product message for $LANG: $MSG${NC}"
    else
        echo -e "   ${RED}✗ Invalid product localization failed for $LANG - HTTP $HTTP_CODE - $MSG${NC}"
    fi

    # Test: Remove invalid cart item -> expect item not found
    BAD_ITEM_ID="00000000-0000-0000-0000-000000000000"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/cart/items/$BAD_ITEM_ID" \
        -H "x-lang: $LANG" \
        -H "Cookie: $LANG_COOKIE")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    MSG=$(extract_json "$BODY" "message")
    if [ "$HTTP_CODE" = "404" ] && echo "$MSG" | grep -iq "item"; then
        echo -e "   ${GREEN}✓ Cart item not found message for $LANG: $MSG${NC}"
    else
        echo -e "   ${RED}✗ Cart item localization failed for $LANG - HTTP $HTTP_CODE - $MSG${NC}"
    fi
}

# Run localization tests: French then English
test_localization fr
test_localization en

echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Tests terminés !${NC}"
echo -e "${BLUE}========================================${NC}\n"
