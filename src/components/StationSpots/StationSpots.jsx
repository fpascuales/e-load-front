import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Progress,
  ProgressLabel,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { spotLoading, updateSpotState } from "../../redux/spots/spots.actions";
import { updateUserPoints, updateUserSpots } from "../../redux/users/users.actions";
import { Bolt, ElectricalServices, Euro, RadioButtonChecked } from "@mui/icons-material";

const StationSpots = () => {
  const { spotsByStation, spotToCharge } = useSelector((state) => state.spots);
  const { user } = useSelector((state) => state.users);
  const { stationSelected } =useSelector((state) => state.stations);
  const [chargeMode, setChargeMode] = useState({});
  const [isChargeComplete, setIsChargeComplete] = useState(false);
  const getBadgeColor = (stateSpot) => {
    switch (stateSpot) {
      case "Libre":
        return "secondaryColor";
      case "Ocupado":
        return "red";
      case "Fuera de Servicio":
        return "orange";
      default:
        return "green";
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setChargeMode((prevChargeMode) => {
        const updatedChargeMode = { ...prevChargeMode };
        let isProgressUpdated = false;
        Object.keys(updatedChargeMode).forEach((spotId) => {
          const newProgress = updatedChargeMode[spotId] + 10;
          if (newProgress > 100) {
            delete updatedChargeMode[spotId];
            setIsChargeComplete((prevChargeComplete) => ({
              ...prevChargeComplete,
              [spotId]: true,
            }));
          } else {
            spotLoading(spotId, newProgress);
            updatedChargeMode[spotId] = newProgress;
            isProgressUpdated = true;
          }
        });
        return isProgressUpdated ? updatedChargeMode : prevChargeMode;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const handleChargeMode = async (spotId) => {
    if (chargeMode[spotId] === undefined && !spotToCharge) {
      setChargeMode((prevChargeMode) => ({
        ...prevChargeMode,
        [spotId]: 0,
      }));
      setIsChargeComplete((prevChargeComplete) => ({
        ...prevChargeComplete,
        [spotId]: false,
      }));
      await updateSpotState(spotId, "Ocupado");
      const loyaltyPoints = user.points + 100;
      await updateUserSpots(user._id, spotId, stationSelected._id);
      await updateUserPoints(user._id, loyaltyPoints);
    }
  };
  const disconnectSpot = async (spotId) => {
    await updateSpotState(spotId, "Libre");
    setChargeMode((prevChargeMode) => {
      const updatedChargeMode = { ...prevChargeMode };
      delete updatedChargeMode[spotId];
      return updatedChargeMode;
    });
    setIsChargeComplete(false);
  };
  
  return (
    <>
      {user === null && (
        <p>Inicia sesión para usar los puntos de carga de esta estación</p>
      )}

      {spotsByStation.map((spot, index) => {
        const chargingProgress = chargeMode[spot._id] || 0;
        const isCharging = chargingProgress > 0 && chargingProgress <= 100;
        const isDisabled = spotToCharge && spotToCharge._id !== spot._id;
        const spotState = isCharging ? "Ocupado" : "Libre";
        const badgeColor = getBadgeColor(spotState);
        return (
          <Card key={spot._id}>
            <CardHeader p={2}>
              <Flex alignItems={"center"} gap={2}>
              <RadioButtonChecked/>
              <Text>Punto de Carga {index + 1}</Text>
              </Flex>
              <Divider/>
            </CardHeader>
            <CardBody p={2}>
              <Flex direction={"column"} gap={1}>
                <Flex>
                  <Bolt/>
                  <Text>Potencia: {spot.power}</Text>
                </Flex>
                <Flex>
                  <ElectricalServices/>
                  <Text>Tipo: {spot.type}</Text>
                </Flex>
                <Flex>
                  <Euro/>
                  <Text>Tarifa: {spot.rate}</Text>
                </Flex> 
              </Flex>
            </CardBody>
            {isChargeComplete[spot._id] && (
              <Button
                bg={'secondaryColor'}
                onClick={() => disconnectSpot(spot._id)}
              >
                DESCONECTAR
              </Button>
            )}
            <CardFooter>
              {user && (
                <Button
                  variant={"ghost"}
                  color='defaultColor'
                  onClick={() => handleChargeMode(spot._id)}
                  disabled={
                    isCharging || isDisabled || spot.state === "Ocupado"
                  }
                >
                  {isChargeComplete[spot._id]
                    ? "CARGA COMPLETA"
                    : isCharging
                    ? "CARGANDO"
                    : "CARGAR"}
                </Button>
              )}
            </CardFooter>
            {isChargeComplete[spot._id] ? (
              <Progress
                value={chargingProgress}
                colorScheme="green"
                height="28px"
              >
                <ProgressLabel fontSize="xl">{chargingProgress}%</ProgressLabel>
              </Progress>
            ) : (
              isCharging && (
                <Progress
                  isIndeterminate
                  value={chargingProgress}
                  colorScheme="green"
                  height="28px"
                >
                  <ProgressLabel color="black" fontSize="xl">
                    {chargingProgress}%
                  </ProgressLabel>
                </Progress>
              )
            )}
            {spotToCharge &&
            spotToCharge.state === "Ocupado" &&
            spotToCharge._id === spot._id ? (
              <Badge bg={badgeColor}>
                {spotToCharge && spotToCharge._id === spot._id
                  ? spotToCharge.state
                  : "Ocupado"}
              </Badge>
            ) : (
              <Badge bg={badgeColor}>{spotState}</Badge>
            )}
          </Card>
        );
      })}
    </>
  );
};

export default StationSpots;



// import {
//   Badge,
//   Button,
//   Card,
//   CardBody,
//   CardFooter,
//   CardHeader,
//   Divider,
//   Flex,
//   Progress,
//   ProgressLabel,
//   Text,
// } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { updateSpotState } from "../../redux/spots/spots.actions";
// import {
//   updateUserPoints,
//   updateUserSpots,
// } from "../../redux/users/users.actions";
// import { Bolt, ElectricalServices, Euro, RadioButtonChecked } from "@mui/icons-material";

// const StationSpots = () => {
//   const { spotsByStation, spotToCharge } = useSelector((state) => state.spots);
//   const { user } = useSelector((state) => state.users);
//   const { stationSelected } =useSelector((state) => state.stations);
//   const [chargeMode, setChargeMode] = useState({});
//   const [isChargeComplete, setIsChargeComplete] = useState(false);
//   const getBadgeColor = (stateSpot) => {
//     switch (stateSpot) {
//       case "Libre":
//         return "secondaryColor";
//       case "Ocupado":
//         return "red";
//       case "Fuera de Servicio":
//         return "orange";
//       default:
//         return "green";
//     }
//   };
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setChargeMode((prevChargeMode) => {
//         const updatedChargeMode = { ...prevChargeMode };
//         let isProgressUpdated = false;
//         Object.keys(updatedChargeMode).forEach((spotId) => {
//           const newProgress = updatedChargeMode[spotId] + 5;
//           if (newProgress > 100) {
//             delete updatedChargeMode[spotId];
//             setIsChargeComplete((prevChargeComplete) => ({
//               ...prevChargeComplete,
//               [spotId]: true,
//             }));
//           } else {
//             updatedChargeMode[spotId] = newProgress;
//             isProgressUpdated = true;
//           }
//         });
//         return isProgressUpdated ? updatedChargeMode : prevChargeMode;
//       });
//     }, 1000);
//     return () => {
//       clearInterval(interval);
//     };
//   }, []);
//   const handleChargeMode = async (spotId) => {
//     if (chargeMode[spotId] === undefined && !spotToCharge) {
//       setChargeMode((prevChargeMode) => ({
//         ...prevChargeMode,
//         [spotId]: 0,
//       }));
//       setIsChargeComplete((prevChargeComplete) => ({
//         ...prevChargeComplete,
//         [spotId]: false,
//       }));
//       await updateSpotState(spotId, "Ocupado");
//       const loyaltyPoints = user.points + 100;
//       await updateUserSpots(user._id, spotId, stationSelected._id);
//       await updateUserPoints(user._id, loyaltyPoints);
//     }
//   };
//   const disconnectSpot = async (spotId) => {
//     await updateSpotState(spotId, "Libre");
//     setChargeMode((prevChargeMode) => {
//       const updatedChargeMode = { ...prevChargeMode };
//       delete updatedChargeMode[spotId];
//       return updatedChargeMode;
//     });
//     setIsChargeComplete(false);
//   };
  
//   return (
//     <>
//       {user === null && (
//         <p>Inicia sesión para usar los puntos de carga de esta estación</p>
//       )}

//       {spotsByStation.map((spot, index) => {
//         const chargingProgress = chargeMode[spot._id] || 0;
//         const isCharging = chargingProgress > 0 && chargingProgress <= 100;
//         const isDisabled = spotToCharge && spotToCharge._id !== spot._id;
//         const spotState = isCharging ? "Ocupado" : "Libre";
//         const badgeColor = getBadgeColor(spotState);
//         console.log(index)
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
//       })}
//     </>
//   );
// };

// export default StationSpots;