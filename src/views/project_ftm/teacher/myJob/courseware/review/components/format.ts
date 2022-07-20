export function systemFormat(thum) {
  switch (thum) {
    case 'FUEL':
      return this.$t('table.fuel')
    case 'ELECTRONIC':
      return this.$t('table.electronic')
    case 'PNEUMATIC_AND_AIR':
      return this.$t('table.pneumaticAndAir')
    case 'HYDRAULIC':
      return this.$t('table.hydraulic')
    case 'POWER_PLANT':
      return this.$t('table.powerPlant')
    case 'FLIGHT_CONTROL':
      return this.$t('table.flightControl')
    case 'AUTO_FLIGHT':
      return this.$t('table.autoFlight')
    case 'LANDING_GEAR':
      return this.$t('table.landingGear')
    case 'OTHERS':
      return this.$t('table.other')
    default:
      return ''
  }
}
