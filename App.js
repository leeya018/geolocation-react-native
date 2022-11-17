/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Button, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {getDistance, getPreciseDistance} from 'geolib';

const locations = [
  {adress: '', latitude: 20.0504188, longitude: 64.4139099},
  {latitude: 51.528308, longitude: -0.3817765},
  {latitude: 10.528308, longitude: -0.3817765},
  {latitude: 21.528308, longitude: -0.3817765},
];
// Function to get permission for location

const requestLocationPermission = async () => {
  console.log('I am herer ');
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};
const App = () => {
  // state to hold location
  const [location, setLocation] = useState(false);
  const [distances, setDistances] = useState([]);

  const calculateDistance = () => {
    const {longitude, latitude} = location.coords;

    return locations.map(loc => {
      return getDistance({longitude, latitude}, loc);
    });
    // alert(`Distance\n\n${dis} Meter\nOR\n${dis / 1000} KM`);
  };

  const sortDistances = () => {
    // if (!location) getLocation();
    const sortedDists = calculateDistance()
      .sort((a, b) => a - b)
      .map(dist => dist + ' Meters');
    console.log(sortedDists);
    setDistances(sortedDists);
    return sortedDists;
  };
  // function to check permissions and get Location
  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
    console.log(location);
  };
  return (
    <View style={styles.container}>
      <Text>Welcome!</Text>
      <View
        style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
        <Button
          title="Get Location"
          onPress={getLocation}
          style={{zIndex: 9999}}
        />
      </View>
      <Text>Latitude: {location ? location.coords.latitude : null}</Text>
      <Text>Longitude: {location ? location.coords.longitude : null}</Text>
      <View
        style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
        <Button title="calc the distance " onPress={sortDistances} />
      </View>
      <Text>The closest place: {distances.length > 0 && distances[0]}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default App;
