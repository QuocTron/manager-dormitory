import useLocationForm from './useLocation';
import Select from 'react-select';

function LocationForm() {
  const { state, onCitySelect, onDistrictSelect, onWardSelect } = useLocationForm(false);

  const { cityOptions, districtOptions, wardOptions, selectedCity, selectedDistrict, selectedWard } = state;

  return (
    <div className="flex flex-col gap-5">
      <label>Tỉnh/Thành</label>
      <Select
        name="cityId"
        isDisabled={cityOptions.length === 0}
        options={cityOptions}
        onChange={(option) => onCitySelect(option)}
        placeholder="--Tỉnh/Thành--"
        defaultValue={selectedCity}
      />
      <label>Quận/Huyện</label>
      <Select
        name="districtId"
        isDisabled={districtOptions.length === 0}
        options={districtOptions}
        onChange={(option) => onDistrictSelect(option)}
        placeholder="--Quận/Huyện--"
        defaultValue={selectedDistrict}
      />
      <label>Phường/Xã</label>
      <Select
        name="wardId"
        isDisabled={wardOptions.length === 0}
        options={wardOptions}
        placeholder="--Phường/Xã--"
        onChange={(option) => onWardSelect(option)}
        defaultValue={selectedWard}
      />
    </div>
  );
}

export default LocationForm;
