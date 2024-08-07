-- CreateTable
CREATE TABLE "Region" (
    "id" INTEGER NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "stateId" INTEGER,
    "autonomyId" INTEGER,
    "needResidencyToWork" BOOLEAN NOT NULL DEFAULT false,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "marketTaxes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "factoryOutputTaxes" JSONB NOT NULL,
    "profitShare" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "seaAccess" BOOLEAN NOT NULL DEFAULT false,
    "buildings" JSONB NOT NULL,
    "resources" JSONB NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 30,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "perk_str" INTEGER NOT NULL DEFAULT 0,
    "perk_edu" INTEGER NOT NULL DEFAULT 0,
    "perk_end" INTEGER NOT NULL DEFAULT 0,
    "regionId" INTEGER,
    "residencyId" INTEGER,
    "leaderOfStateId" INTEGER,
    "econMinisterOfStateId" INTEGER,
    "foreignMinisterOfStateId" INTEGER NOT NULL,
    "governorOfAutoId" INTEGER,
    "partyId" INTEGER,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "State" (
    "id" INTEGER NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "governmentForm" TEXT NOT NULL DEFAULT 'dictatorship',
    "leaderIsCommander" BOOLEAN NOT NULL DEFAULT false,
    "leaderTermStart" TIMESTAMP(3),
    "blocId" INTEGER,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Autonomy" (
    "id" INTEGER NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "stateId" INTEGER,
    "governorId" INTEGER,

    CONSTRAINT "Autonomy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Storage" (
    "id" SERIAL NOT NULL,
    "stateMoney" INTEGER NOT NULL DEFAULT 0,
    "stateGold" INTEGER NOT NULL DEFAULT 0,
    "stateOil" INTEGER NOT NULL DEFAULT 0,
    "stateOre" INTEGER NOT NULL DEFAULT 0,
    "stateUranium" INTEGER NOT NULL DEFAULT 0,
    "stateDiamonds" INTEGER NOT NULL DEFAULT 0,
    "money" INTEGER NOT NULL DEFAULT 0,
    "gold" INTEGER NOT NULL DEFAULT 0,
    "oil" INTEGER NOT NULL DEFAULT 0,
    "ore" INTEGER NOT NULL DEFAULT 0,
    "uranium" INTEGER NOT NULL DEFAULT 0,
    "diamonds" INTEGER NOT NULL DEFAULT 0,
    "liquidOxygen" INTEGER NOT NULL DEFAULT 0,
    "helium3" INTEGER NOT NULL DEFAULT 0,
    "rivalium" INTEGER NOT NULL DEFAULT 0,
    "antirad" INTEGER NOT NULL DEFAULT 0,
    "energyDrink" INTEGER NOT NULL DEFAULT 0,
    "spaceRockets" INTEGER NOT NULL DEFAULT 0,
    "lss" INTEGER NOT NULL DEFAULT 0,
    "tanks" INTEGER NOT NULL DEFAULT 0,
    "aircrafts" INTEGER NOT NULL DEFAULT 0,
    "missiles" INTEGER NOT NULL DEFAULT 0,
    "bombers" INTEGER NOT NULL DEFAULT 0,
    "battleships" INTEGER NOT NULL DEFAULT 0,
    "laserDrones" INTEGER NOT NULL DEFAULT 0,
    "moonTanks" INTEGER NOT NULL DEFAULT 0,
    "spaceStations" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Party" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" INTEGER,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factory" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "playerId" INTEGER,
    "regionId" INTEGER,
    "type" TEXT NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "Factory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bloc" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Bloc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_leaderOfStateId_key" ON "Player"("leaderOfStateId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_econMinisterOfStateId_key" ON "Player"("econMinisterOfStateId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_foreignMinisterOfStateId_key" ON "Player"("foreignMinisterOfStateId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_governorOfAutoId_key" ON "Player"("governorOfAutoId");

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_autonomyId_fkey" FOREIGN KEY ("autonomyId") REFERENCES "Autonomy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_residencyId_fkey" FOREIGN KEY ("residencyId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_leaderOfStateId_fkey" FOREIGN KEY ("leaderOfStateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_econMinisterOfStateId_fkey" FOREIGN KEY ("econMinisterOfStateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_foreignMinisterOfStateId_fkey" FOREIGN KEY ("foreignMinisterOfStateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_governorOfAutoId_fkey" FOREIGN KEY ("governorOfAutoId") REFERENCES "Autonomy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "State" ADD CONSTRAINT "State_blocId_fkey" FOREIGN KEY ("blocId") REFERENCES "Bloc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autonomy" ADD CONSTRAINT "Autonomy_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
