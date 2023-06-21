// const StationSpotCard = ({ spot, index }) => {
//         const chargingProgress = chargeMode[spot._id] || 0;
//         const isCharging = chargingProgress > 0 && chargingProgress <= 100;
//         const isDisabled = spotToCharge && spotToCharge._id !== spot._id;
//         const spotState = isCharging ? "Ocupado" : "Libre";
//         const badgeColor = getBadgeColor(spotState);
//         return (
//           <Card key={spot._id}>
//             <CardHeader p={2}>
//               <Flex alignItems={"center"} gap={2}>
//               <RadioButtonChecked/>
//               <Text>Punto de Carga {index + 1}</Text>
//               </Flex>
//               <Divider/>
//             </CardHeader>
//             <CardBody p={2}>
//               <Flex direction={"column"} gap={1}>
//                 <Flex>
//                   <Bolt/>
//                   <Text>Potencia: {spot.power}</Text>
//                 </Flex>
//                 <Flex>
//                   <ElectricalServices/>
//                   <Text>Tipo: {spot.type}</Text>
//                 </Flex>
//                 <Flex>
//                   <Euro/>
//                   <Text>Tarifa: {spot.rate}</Text>
//                 </Flex> 
//               </Flex>
//             </CardBody>
//             {isChargeComplete[spot._id] && (
//               <Button
//                 bg={'secondaryColor'}
//                 onClick={() => disconnectSpot(spot._id)}
//               >
//                 DESCONECTAR
//               </Button>
//             )}
//             <CardFooter>
//               {user && (
//                 <Button
//                   variant={"ghost"}
//                   color='defaultColor'
//                   onClick={() => handleChargeMode(spot._id)}
//                   disabled={
//                     isCharging || isDisabled || spot.state === "Ocupado"
//                   }
//                 >
//                   {isChargeComplete[spot._id]
//                     ? "CARGA COMPLETA"
//                     : isCharging
//                     ? "CARGANDO"
//                     : "CARGAR"}
//                 </Button>
//               )}
//             </CardFooter>
//             {isChargeComplete[spot._id] ? (
//               <Progress
//                 value={chargingProgress}
//                 colorScheme="green"
//                 height="28px"
//               >
//                 <ProgressLabel fontSize="xl">{chargingProgress}%</ProgressLabel>
//               </Progress>
//             ) : (
//               isCharging && (
//                 <Progress
//                   isIndeterminate
//                   value={chargingProgress}
//                   colorScheme="green"
//                   height="28px"
//                 >
//                   <ProgressLabel color="black" fontSize="xl">
//                     {chargingProgress}%
//                   </ProgressLabel>
//                 </Progress>
//               )
//             )}
//             {spotToCharge &&
//             spotToCharge.state === "Ocupado" &&
//             spotToCharge._id === spot._id ? (
//               <Badge bg={badgeColor}>
//                 {spotToCharge && spotToCharge._id === spot._id
//                   ? spotToCharge.state
//                   : "Ocupado"}
//               </Badge>
//             ) : (
//               <Badge bg={badgeColor}>{spotState}</Badge>
//             )}
//           </Card>
//         );
// }

// export default StationSpotCard