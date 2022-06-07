import axios from 'axios';
import { useEffect, useState } from 'react';
import { PATHS } from './path';
import { getRoomBuilding } from '~/redux/apiRequest';

const FETCH_TYPES = {
  BUILDINGS: 'FETCH_BUILDINGS',
  ROOM_BUILDINGS: 'FETCH_ROOM_BUILDINGS',
};
async function fetchRoomBuildingOptions(fetchType, buildingId, gender) {
  let url;
  switch (fetchType) {
    case FETCH_TYPES.BUILDINGS: {
      url = `${PATHS.BUILDING_BY_GENDER}${gender}`;
      const buildings = (await axios.get(url)).data['buildings'];
      return buildings.map(({ _id, name }) => ({ value: _id, label: name }));
    }
    case FETCH_TYPES.ROOM_BUILDINGS: {
      url = `${PATHS.GET_ALL_ROOM_BY_BUILDING}/${buildingId}`;
      const roomBuildings = (await axios.get(url)).data['roomBuildings'];
      return roomBuildings.map(({ _id, name }) => ({ value: _id, label: name }));
    }
    default: {
      return [];
    }
  }
}

async function fetchInitialData() {
  const buildingsId = await fetchRoomBuildingOptions(FETCH_TYPES.BUILDINGS, '', 'Nam')[0]._id;
  const [buildings, roomBuildings] = await Promise.all([
    fetchRoomBuildingOptions(FETCH_TYPES.BUILDINGS, '', 'Nam'),
    fetchRoomBuildingOptions(FETCH_TYPES.ROOM_BUILDINGS, buildingsId, 'Nam'),
  ]);
  return {
    genders: [{ label: 'Nam' }, { label: 'Nữ' }],
    buildings: buildings,
    roomBuildings: roomBuildings,
    selectedGender: 'Nam',
    selectedBuilding: buildings[0],
    selectedRoomBuilding: roomBuildings[0],
  };
}

function useRoomBuildingForm(shouldFetchInitialForm) {
  const [state, setState] = useState({
    genders: [],
    buildings: [],
    roomBuildings: [],
    selectedGender: null,
    selectedBuilding: null,
    selectedRoomBuilding: null,
  });

  const { selectedGender, selectedBuilding, selectedRoomBuilding } = state;

  useEffect(() => {
    (async function () {
      if (shouldFetchInitialForm) {
        const initialData = await fetchInitialData();
        setState(initialData);
      } else {
        setState({
          ...state,
          genders: [{ label: 'Nam' }, { label: 'Nữ' }],
        });
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (!selectedGender) {
        return;
      }
      const options = await fetchRoomBuildingOptions(FETCH_TYPES.BUILDINGS, '', selectedGender.label);
      setState({ ...state, buildings: options });
    })();
  }, [selectedGender]);
  useEffect(() => {
    (async () => {
      if (!selectedBuilding) {
        return;
      }
      const options = await fetchRoomBuildingOptions(FETCH_TYPES.ROOM_BUILDINGS, selectedBuilding.value);
      setState({ ...state, roomBuildings: options });
    })();
  }, [selectedBuilding]);
  useEffect((dispatch, navigate) => {
    (async () => {
      if (!selectedRoomBuilding) {
        return;
      }
    })();
  }, []);

  function onGenderSelect(option) {
    if (option !== selectedGender) {
      setState({
        ...state,
        buildings: [],
        roomBuildings: [],
        selectedGender: option,
        selectedBuilding: null,
        selectedRoomBuilding: null,
      });
    }
  }

  function onBuildingSelect(option) {
    if (option !== selectedBuilding) {
      setState({
        ...state,
        roomBuildings: [],
        selectedBuilding: option,
        selectedRoomBuilding: null,
      });
    }
  }

  function onRoomBuildingsSelect(dispatch, navigate, option) {
    setState({
      ...state,
      selectedRoomBuilding: option,
    });
    getRoomBuilding(dispatch, navigate, option.value, '/');
  }
  return { state, onGenderSelect, onBuildingSelect, onRoomBuildingsSelect };
}
export default useRoomBuildingForm;
