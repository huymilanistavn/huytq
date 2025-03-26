import { StyleSheet, Platform } from 'react-native';

/**Define style global */
export default StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },

  /** floating input*/
  inputItemContainer: {
    marginTop: 23,
    marginHorizontal: 16,
    backgroundColor: '#122F4A',
    borderRadius: 8,
    height: 52,
    borderColor: '#FA8A7E',
  },
  textInputContent: {
    color: '#fff',
    marginTop: 16,
    marginLeft: 16,
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 14
  },
  containerInput: {
    marginTop: Platform.OS === 'android' ? -1 : 0,
    height: 52,
    marginRight: 16
  },

  giaoDichItem: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    //borderBottomColor: '#0F273E',
    //borderBottomWidth: 1,
    paddingVertical: 10,
    //backgroundColor: '#0C1F31'
  },
  giaoDichTextLeft1: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Semibold',
    color: '#F2F2F2'
  },
  giaoDichTextLeft2: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
    color: '#F2F2F2'
  },
  giaoDichTextLeft3: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
    color: '#E6F0F2',
    marginTop: 6
  },
  giaoDichTextRight1: {
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: 14,
    color: '#E6F0F2',
    alignSelf: 'flex-end',
  },
  giaoDichTextRight2: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4
  }

});
