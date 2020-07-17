connect system/MsprProjet34@XEPDB1
drop user rRecycle cascade;

create user rRecycle identified by rRecycle
default tablespace users;

ALTER USER rRecycle quota unlimited ON USERS;
grant CONNECT, RESOURCE, CREATE PROCEDURE, CREATE TRIGGER to rRecycle;

connect rRecycle/rRecycle@XEPDB1

-- les tables sans FK
-- ==================
create table entreprise
(Siret		 number(15) not null,
RaisonSociale	 varchar(50) not null,
NoRueEntr	 number(3),
RueEntr		 varchar(200),
CpostalEntr	 number(5),
VilleEntr	 varchar(50),
NoTel		 char(10),
Contact		 varchar(50),
constraint PK_entreprise primary key(Siret)
);

create table centretraitement
(NoCentre	 number(3) not null,
NomCentre	 varchar(100),
NoRueCentre	 number(3),
RueCentre	 varchar(200),
CpostalCentre	 number(5),
VilleCentre	 varchar(50),
NoTel 		 char(10),
Contact 	 varchar(50),
constraint PK_centretraitement primary key(Nocentre)
);
  

create table fonction
(NoFonction	 number(3) not null,
NomFonction	 varchar(50) not null,
nombreAppAutorises	number(1),
constraint PK_Fonction primary key(NoFonction)
);	

-- AJOUT : TarifForfaitaire, TarifParLot, Unite
create table typedechet
(NoTypeDechet	 number(3) not null,
NomTypeDechet	 varchar(50),
Niv_danger	 number(1),
TarifForfaitaire number(4),
TarifParLot number(4),
Unite varchar(5),
constraint PK_typedechet primary key(Notypedechet)
);

-- AJOUT : CapMax, CapActuel
-- POSSIBILITE : AJOUT reference(typedechet) pour chaque camion ; Nouvelles Tables Modele, Marque
create table camion
(NoImmatric	 char(10) not null,
DateAchat	 date,
Modele 		 varchar(50) not null,
Marque		 varchar(50) not null,
CapMax		 number(8),
CapActuel	 number(8),
constraint PK_camion primary key(NoImmatric)
);

-- Nouvelle Table : Represente les differents sites de RECYCL
-- ===========================
create table sites
(NoSite	 number(5) not null,
NoRueSite number(3),
RueSite	 varchar(200),
CPostalsite number(5),
VilleSite 	varchar(100),
constraint PK_site primary key (NoSite)
);


-- les tables avec FK 'simple'
-- ===========================
-- Ancienne Table Employe
-- AJOUT : Login, Pass, Disponibilite, NombreAppsConnectes, NombreTentativesPass, NoSite
create table utilisateur
(NoEmploye number(5),
Login	varchar(50),
Pass	varchar(50),
Nom		 varchar(50),
Prenom		 varchar(50),
dateNaiss	 date,
dateEmbauche	 date,
Disponibilite	number(1),
NombreAppsConnectes	number(1),
NombreTentativesPass number(1),
Salaire		 number(8,2),
NoFonction	 number(3),
NoSite	number(5) not null,
constraint PK_utilisateur primary key(noemploye),
constraint FK_utilisateur_fonction foreign key (nofonction) references fonction(nofonction),
constraint FK_utilisateur_sites foreign key (NoSite) references sites(NoSite)
);

create table tournee
(NoTournee	 number(6) not null,
DateTournee	 date,
NoImmatric	 char(10) not null,
NoEmploye	 number(5) not null,
constraint PK_tournee primary key(NoTournee),
constraint FK_tournee_camion foreign key (NoImmatric) references camion(noImmatric),
constraint FK_tournee_utilisateur foreign key (NoEmploye) references utilisateur(NoEmploye)
);

-- Nouvelle Table : Repr�sentes les poubelles connect�es
-- ===========================
create table poubelles
(NoPoubelle number(15),
NoRuePoubelle number(3),
RuePoubelle	 varchar(200),
CpostalPoubelle	 number(5),
VillePoubelle	 varchar(50),
NoTypeDechet	 number(3) not null,
constraint PK_poubelles primary key (NoPoubelle),
constraint FK_poubelles_typedechet foreign key (NoTypeDechet) references typedechet(NoTypeDechet)
);

 -- sans Web_O_N / ATT chargem table
 -- AJOUT : NoSite,NoPoubelle
create table demande
(NoDemande	 number(6) not null,
DateDemande	 date,
DateEnlevement	 date,
Web_O_N	char(1),
Siret		 number(15),
NoPoubelle number(15),
NoSite	number(5) not null,
constraint PK_demande primary key(Nodemande),
constraint FK_demande_entreprise foreign key (Siret) references entreprise(Siret),
constraint FK_demande_sites foreign key (NoSite) references sites(NoSite),
constraint FK_demande_poubelles foreign key (NoPoubelle) references poubelles(NoPoubelle)
);


-- les tables avec FK/PK
-- =====================

-- avec remarque /  ATT : chargement table
-- AJOUT : NoTournee
create table detaildemande
(QuantiteEnlevee	 number(3) not null,
QuantiteDemande number(3),
Remarque		 varchar(100),
NoDemande		 number(6) not null,
NoTypeDechet		 number(3) not null,
NoTournee	 number(6) not null,
constraint PK_detaildemande primary key(Nodemande, notypedechet),
constraint FK_detaildem_demande foreign key (NoDemande) references demande(NoDemande),
constraint FK_detaildem_typedech foreign key (notypedechet) references typedechet(notypedechet),
constraint FK_detaildem_tournee foreign key (NoTournee) references tournee(NoTournee)
);

create table detaildepot
(QuantiteDeposee	 number(3) not null,
NoTournee		 number(6) not null,
NoTypeDechet		 number(3) not null,
NoCentre		 number(3) not null,
constraint PK_detaildepot primary key(Notournee, notypedechet, nocentre),
constraint FK_detaildep_tournee foreign key (NoTournee) references tournee(NoTournee),
constraint FK_detaildep_typedech foreign key (notypedechet) references typedechet(notypedechet),
constraint FK_detaildep_centre foreign key (NoCentre) references centretraitement(NoCentre)
);

-- Nouvelle Table : Gestion stock centre de traitement
create table detailCentreTypeDechet
(NoCentre number(3) not null,
NoTypeDechet number(3) not null,
CapMax number(10),
constraint PF_detailCentreTypeDechet primary key (NoCentre,NoTypeDechet),
constraint FK_detailCentreTypeDechet_centretraitement foreign key (NoCentre) references centretraitement(NoCentre),
constraint FK_detailCentreTypeDechet_typedechet foreign key (NoTypeDechet) references typedechet(notypedechet)
);

-- Cr�ation de s�quences
create sequence seq_typedechet start with 1 increment by 1;
create sequence seq_centre start with 1 increment by 1;
create sequence seq_utilisateur start with 1 increment by 1;
create sequence seq_tournee start with 1 increment by 1;
create sequence seq_demande start with 1 increment by 1;
-- Nouvelle Sequence
create sequence seq_poubelles start with 1 increment by 1;

-- Trigger
-- =====================
CREATE OR REPLACE TRIGGER TR_typedechet
	BEFORE INSERT ON typedechet FOR EACH ROW
BEGIN
	:NEW.NoTypeDechet := seq_typedechet.NEXTVAL;
END;
/
CREATE OR REPLACE TRIGGER TR_centre
	BEFORE INSERT ON centretraitement FOR EACH ROW
BEGIN
	:NEW.NoCentre := seq_centre.NEXTVAL;
END;
/
CREATE OR REPLACE TRIGGER TR_utilisateur
	BEFORE INSERT ON utilisateur FOR EACH ROW
BEGIN
	:NEW.NoEmploye := seq_utilisateur.NEXTVAL;
END;
/
CREATE OR REPLACE TRIGGER TR_tournee
	BEFORE INSERT ON tournee FOR EACH ROW
BEGIN
	:NEW.NoTournee := seq_tournee.NEXTVAL;
END;
/
CREATE OR REPLACE TRIGGER TR_demande
	BEFORE INSERT ON demande FOR EACH ROW
BEGIN
	:NEW.NoDemande := seq_demande.NEXTVAL;
END;
/
CREATE OR REPLACE TRIGGER TR_poubelles
	BEFORE INSERT ON poubelles FOR EACH ROW
BEGIN
	:NEW.NoPoubelle := seq_poubelles.NEXTVAL;
END;
/
