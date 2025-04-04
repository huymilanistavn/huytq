import Config from 'react-native-config';
import { deleteMethod, get, post, putMethod, getData, postData } from '../../utils/apiHelper';
import { API_URL } from './constants';

/** Get token resetCommonApi login */
export const resetCommonApi = (token: string) =>
  get({
    path: `${API_URL.REST_COMMON}`,
    description: '',
    errorMessage: ``,
  });

export function resetCommonApiX(token: string) {
  return get({
    path: `${API_URL.REST_COMMON}`,
    description: '',
    errorMessage: ``,
  });
}

export class Api {
  register(username: string, password: string, confirmPassword: string, phone: string) {
    const data = post({
      path: `${API_URL.REGISTER}`,
      data: { username, password, confirmPassword, phone },
    });
    //console.log({username,password,confirmPassword,phone,lucky_number});
    return data;
  };

  login(username: string, password: string) {
    return post({
      path: `${API_URL.LOGIN}`,
      data: { username, password },
    });
  };

  logout() {
    return post({
      path: `${API_URL.LOGOUT}`,
      data: {},
    });
  }

  refresh() {
    return get({
      path: `${API_URL.REFRESH}`,
    })
  };

  verifyinfo(username: string, phone: string, phoneoremail: boolean) {
    if (phoneoremail) //phone
      return post({
        path: `${API_URL.VERIFYINFO}`,
        data: { username, phone },
      });
    else { //email
      let email = phone;
      return post({
        path: `${API_URL.VERIFYINFO}`,
        data: { username, email },
      });
    }
  }

  getuserbank() {
    return get({
      path: `${API_URL.BANKS}`,
    })
  };

  saveuserbank(bank_code: string, bank_account_name: string, bank_account_no: string) {
    //console.log({bank_code, bank_account_name, bank_account_no});
    return post({
      path: `${API_URL.BANKS}`,
      data: { bank_code, bank_account_name, bank_account_no },
    });
  };

  updateuserbank(id: string, bank_code: string, bank_account_name: string, bank_account_no: string) {
    //console.log("goi ham update");
    return putMethod({
      path: `${API_URL.USER}/banks/${id}`,
      data: { bank_code, bank_account_name, bank_account_no },
    });
  };

  deleteuserbank(id: string) {
    //console.log("goi ham update");
    return deleteMethod({
      path: `${API_URL.USER}/banks/${id}`,
      data: {},
    });
  };

  lodeGetCities(date: string) {
    return get({
      path: `${API_URL.LODE}/cities?date=${date}`,
    })
  }
  lodeGetResult(date: string, city: number) {
    return get({
      path: `${API_URL.LODE}/results?date=${date}&city=${city}`,
    })
  }
  lodeSinGetLink(type: string) {
    return get({
      path: `${API_URL.LODEURL}?tab=${type}`,
    })
  }
  lodeGetLink() {
    return get({
      path: `${API_URL.LODE2URL}`,
    })
  }
  lodeGetLinkVirtual() {
    return get({
      path: `${API_URL.LODEVIRTUAL}`,
    })
  }
  slotjackpot() {
    return get({
      path: `${API_URL.SLOT}/jackpot`,
    })
  };

  topWinSlot() {
    return get({
      path: `${API_URL.GAMES}/topWinSlot?limit=10`,
    })
  };

  allgames() {
    return get({
      path: `${API_URL.GAMES}?partner_provider=mg_slot,habanero,redtiger,cq9,vingame,pragmatic,netent,qtech,spinomenal&limit=30`,
    })
  };
  casinogames(limit: number) {
    return get({
      //path: `${API_URL.GAMES}?partner_provider=b52,go&display_type=15&limit=${limit}`,
      path: `${API_URL.GAMES}?partner_provider=go,rik&display_type=15&limit=${limit}`,
    })
  };
  casinogamesbanner() {
    return get({
      path: `${API_URL.GAMES}?partner_provider=go,rik&display_type=10&limit=100`,
    })
  };
  hotgames() {
    return get({
      path: `${API_URL.GAMES}?display_type=17&limit=100`,
    })
  };
  newgames() {
    return get({
      path: `${API_URL.GAMES}?display_type=20&limit=100`,
      description: '',
      errorMessage: ``,
    })
  };
  bancagames(limit: number) {
    return get({
      path: `${API_URL.GAMES}?display_type=9&limit=${limit}`,
    })
  };
  quaysogames(limit: number) {
    return get({
      path: `${API_URL.GAMES}?partner_provider=vingame&display_type=7&limit=${limit}`,
    })
  };
  lodegames() {
    return get({
      path: `${API_URL.GAMES}?partner_provider=vingame&display_type=8`,
    })
  };
  gamenhanh() {
    return get({
      path: `${API_URL.GAMES}?display_type=14&limit=100`,
    })
  };
  nohugames(limit: number) {
    return get({
      path: `${API_URL.GAMES}?partner_provider=vingame&display_type=3&limit=${limit}`,
    })
  };
  tablegames() {
    return get({
      path: `${API_URL.GAMES}?display_type=2&limit=100`,
    })
  };
  ingame() {
    return get({
      path: `${API_URL.GAMES}?display_type=5&limit=100`,
    })
  };
  slots() {
    return get({
      path: `${API_URL.GAMES}?display_type=3&limit=250`,
    })
  };
  keno() {
    return get({
      path: `${API_URL.GAMES}?display_type=18&limit=48`,
    })
  };
  gamekhac() {
    return get({
      path: `${API_URL.GAMES}?display_type=19&limit=48`,
    })
  };
  slotProvider(slotName: string) {
    //console.log(`${API_URL.GAMES}?display_type=3&limit=100&partner_provider=${slotName}`);
    return get({
      path: `${API_URL.GAMES}?display_type=3&limit=100&partner_provider=${slotName}`,
    })
  };

  allCasino() {
    return get({
      path: `${API_URL.CASINO}`,
    })
  };
  casinoProvider(casinoName: string) {
    return get({
      path: `${API_URL.CASINO}/search?limit=12&keyword=${casinoName}`,
    })
  };
  hotmatchNews() {
    return get({
      path: `wp-json/scores/v1/all`,
    })
  };
  resultMatchList() {
    return getData({
      path: `api/v2/sportdata/matches?status=FT&limit=5&offset=0`,
    })
  };
  hotMatchList() {
    return getData({
      path: `api/v2/sportdata/hotmatches?limit=10&offset=0`,
    })
  };
  matchList(cid: number, offset: number) {
    return getData({
      path: `api/v2/sportdata/matches?cid=${cid}&limit=10&offset=${offset}`,
    })
  };
  seasonsInfo(cid: number) {
    return getData({
      path: `api/v2/sportdata/seasons?cid=${cid}`,
    })
  };
  standing(cid: number, year: number) {
    return getData({
      path: `api/v2/sportdata/standings?cid=${cid}&year=${year}`,
    })
  };
  topMatchBet() {
    return getData({
      path: `api/v1/statistic/game/topMatch?limit=10`,
    })
  };
  winnerList(gamename: string) {
    return getData({
      path: `api/v1/statistic/user/winners?limit=10&offset=0&game=${gamename}`,
    })
  };
  gamePortal(limit: number) {
    return getData({
      path: `api/v1/gamePortal?limit=${limit}`,
    })
  }

  competitions() {
    return getData({
      path: `api/v2/sportdata/competitions`,
    })
  }
  coTheThich() {
    return get({
      path: `${API_URL.GAMES}?display_type=1&limit=100`,
    })
  };

  historyTransactions(action: string, start: string, end: string, limit: number) {
    return get({
      path: `${API_URL.TRANSACTIONS}?action=${action}&page=1&start=${start}&end=${end}&limit=${limit}`,
    })
  };

  historyTransactionsType(action: string, limit: number) {
    return get({
      path: `${API_URL.TRANSACTIONS}?action=${action}&limit=${limit}`,
    })
  };

  indexAccount() {
    return get({
      path: `${API_URL.ACCOUNT}/index`,
    })
  }
  commission(start: string, end: string) {
    //console.log(`${API_URL.COMMISSIONS}?&start=${start}&end=${end}`);
    return get({
      path: `${API_URL.COMMISSIONS}?start=${start}&end=${end}`,
    })
  };
  commissionType(type: string) {
    //type = YESTERDAY || LAST_WEEK || All
    return get({
      path: `${API_URL.ACCOUNT}/commission?type=${type}`,
    })
  };

  commissionEvent(type: string) {
    //console.log(`${API_URL.COMMISSIONS}?&start=${start}&end=${end}`);
    return getData({
      path: `api-promotion/v1/user/commission?type=${type}`,
    })
  };

  commissionPromotionEvent(type: string) {
    //console.log(`${API_URL.COMMISSIONS}?&start=${start}&end=${end}`);
    return getData({
      path: `api-promotion/v1/commission/user?type=${type}`,
    })
  };

  lastWinningNumber() {
    return get({
      path: `${API_URL.ACCOUNT}/lastWinningNurmber`,
    })
  };

  transactionsDetail(id: number) {
    return get({
      path: `${API_URL.PAYMENT}/invoice/${id}`,
    })
  };
  betDetail(id: number) {
    return get({
      path: `${API_URL.LSBET}?id=${id}`,
    })
  };

  historyBetAll(status: string, start: string, end: string, limit: number) {
    return get({
      path: `${API_URL.LSBALL}?status=${status}&start=${start}&end=${end}&limit=${limit}`,
    })
  };

  historyAsportAll(status: string, start: string, end: string, limit: number) {
    return get({
      path: `${API_URL.LSBATHENA}?status=${status}&start=${start}&end=${end}&game_type=all&limit=${limit}`,
    })
  };

  getDepositeAvailable() {
    return get({
      path: `${API_URL.PAYMENT}/indexdeposit`,
    })
  };

  paywin(to_bank_code: string, method: string, smartpay_code: string, amount_smartpay_mask: string
    , package_id: number, amount_smartpay: string, wallet: number) { //smartpay
    return post({
      path: `${API_URL.PAYMENT}/smartpay`,
      data: { to_bank_code, method, smartpay_code, amount_smartpay_mask, package_id, amount_smartpay, wallet },
    })
  }

  getCodepay() {
    return get({
      path: `${API_URL.USER}/codepay`,
    })
  };

  getMomo() {
    return get({
      path: `${API_URL.DOMAIN}/momo/code`,
    })
  };

  sendVerifyEmail(email: string) {
    return get({
      path: `${API_URL.USER}/send-verify-email?email=${email}`,
    })
  };

  //have to change in release real domain
  getAllPosts() {
    return get({
      path: `${API_URL.POSTSLIST}`,
    })
  };
  getPosts(catids: number, limit: number) {
    return get({
      path: `${API_URL.POSTS}/?catIds=${catids}&limit=${limit}&offset=0`,
    })
  };
  getLatestPosts(catids: string) {
    return get({
      path: `${API_URL.POSTS}/latest?cate_id=${catids}`,
    })
  };
  getPostDetail(alias: string) {
    return get({
      path: `${API_URL.POSTDETAIL}/?alias=${alias}`,
    })
  };

  heroBanner() {
    return get({
      path: `${API_URL.HEROBANNER}`,
    })
  }

  //full or special link
  promotionList() {
    return getData({
      path: `api-promotion/v1/promotion/list`,
    })
  }

  eventKing(date: string) {
    return getData({
      path: `api-promotion/v1/king/bet?date=${date}`,
    })
  }

  eventSum(from_date: string, to_date: string) {
    return getData({
      path: `api-promotion/v1/lucky-bet/sum?from_date=${from_date}&to_date=${to_date}`,
    })
  }

  eventTop(page: number, from_date: string, to_date: string) {
    return getData({
      path: `api-promotion/v1/lucky-bet/top?page=${page}&limit=6&from_date=${from_date}&to_date=${to_date}`,
    })
  }

  notificationCount() {
    return get({
      path: `${API_URL.NOTIFICATION}/count?isViewed=false&hideRemove=true`,
    })
  }
  notificationList() {
    return get({
      path: `${API_URL.NOTIFICATION}?limit=20&offset=0`,
    })
  }
  notification(id: string) {
    return get({
      path: `${API_URL.NOTIFICATION}/${id}`,
    })
  }
  hiddenNotify(ids: any) {
    return post({
      path: `${API_URL.HIDDENNOTIFY}`,
      data: { ids },
    });
  };
  viewedNotify(ids: any) {
    return post({
      path: `${API_URL.VIEWEDNOTIFY}`,
      data: { ids },
    });
  };
  // tetTopList(){
  //   return getData({
  //     path: `api-promotion/v1/tet/top`,
  //   })
  // }

  // tetLixi(){
  //   return getData({
  //     path: `api-promotion/v1/tet/lixi/top?limit=100`,
  //   })
  // }

  // tetLookBack(){
  //   return getData({
  //     path: `api-promotion/v1/lookback`,
  //   })
  // }

  //using for Game
  getRealLink(link: string) {
    //console.log(`${API_URL.DOMAIN}${link}`);
    return get({
      path: `${API_URL.DOMAIN}${link}`,
    })
  };

  //using for KSport
  getRealLinkSport(match_id: number, league_id: number, live: string) {
    return get({
      path: `${API_URL.KSPORTURL}?matchId=${match_id}&leagueId=${league_id}&live=${live}`,
    })
  };

  //using for SinSport
  getRealLinkSinSport(match_id: number, league_id: number, live: string) {
    //console.log(`${API_URL.SPORTLINK}?matchId=${match_id}&leagueId=${league_id}&live=${live}`);
    return get({
      path: `${API_URL.SPORTLINK}?matchId=${match_id}&leagueId=${league_id}&live=${live}`,
    })
  };

  //using for Sport Homepage
  getRealLinkSportHome(event_id: number, league_id: number) {
    return get({
      path: `${API_URL.KSPORTURL}?agentId=11&eventId=${event_id}&leagueId=${league_id}&sportId=1`,
    })
  };

  //using for a-Sport Athena
  getRealLinkAthenaSport(match_id: number, league_id: number, live: string) {
    return get({
      path: `${API_URL.SPORTURL}?matchId=${match_id}&leagueId=${league_id}&live=${live}`,
    })
  };

  //using for Esport
  getRealLinkESport(str_type: string) {
    if (str_type === 'sinsports') {
      return get({
        path: `${API_URL.SINSPORTLINK}`,
      })
    }
    if (str_type === 'csports') {
      return get({
        path: `${API_URL.SPORTURL}`,
      })
    }
    if (str_type === 'ksports') {
      return get({
        path: `${API_URL.KSPORTURL}`,
      })
    }
    if (str_type === 'vsports') {
      return get({
        path: `${API_URL.VSPORTURL}`,
      })
    }

    if (str_type === 'tpsports') {
      return get({
        path: `${API_URL.TSPORTURL}`,
      })
    }
    if (str_type === 'imsports') {
      return get({
        path: `${API_URL.ISPORTURL}`,
      })
    }
    if (str_type === 'ssports') {
      return get({
        path: `${API_URL.SSPORTURL}`,
      })
    }

    //default
    return get({
      path: `${API_URL.ESPORTLINK}`,
    })
  };

  //using for Casino
  getRealLinkCasino(partnerCode: string, partnerGameId: string) {
    //console.log(`${API_URL.CASINOLINK}?partnerCode=${partnerCode}&partnerGameId=${partnerGameId}`);
    return get({
      path: `${API_URL.CASINOLINK}?partnerCode=${partnerCode}&partnerGameId=${partnerGameId}`,
    })
    // return getData({
    //   path: `api/playCasino?partnerCode=${partnerCode}&partnerGameId=${partnerGameId}`,
    // })
  };

  //using for Top Played GAME
  getRealLinkTopPlayedGame(partnerProvider: string, partnerGameId: string) {
    return get({
      path: `${API_URL.GAMEURL}?partnerProvider=${partnerProvider}&partnerGameId=${partnerGameId}`,
    })
  };

  //using for CocosGameList
  getAllCocosGames() {
    //console.log(`${API_URL.CASINOLINK}?partnerCode=${partnerCode}&partnerGameId=${partnerGameId}`);
    return get({
      path: `${API_URL.GAMES}/native`,
    })
  };

  checkEmail(email: string) {
    return post({
      path: `${API_URL.CHECKEMAIL}`,
      data: { email },
    })
  };

  forgotPassword(email: string) {
    return post({
      path: `${API_URL.FORGOTPASSWORD}?method=email`,
      data: { email },
    })
  };

  transfer(amount: number, type: string) {
    //console.log({ amount, type });
    return post({
      path: `${API_URL.TRANSFER}`,
      data: { amount, type },
    });
  };

  updateinfo(fullname: string, email: string) {
    //console.log({ amount, type });
    return post({
      path: `${API_URL.UPDATEINFO}`,
      data: { fullname, email },
    });
  };
  updateinfobankname(bank_name: string) {
    //console.log({ bank_name });
    return post({
      path: `${API_URL.UPDATEINFO}`,
      data: { bank_name },
    });
  };

  allUserBank() {
    return get({
      path: `${API_URL.BANKS}`,
    })
  };

  updatePassword(password: string, newPassword: string, confirmPassword: string) {
    //console.log({ amount, type });
    return post({
      path: `${API_URL.UPDATEPASSWORD}`,
      data: { password, newPassword, confirmPassword },
    });
  };

  depositBank(amount_deposit: string, amount_deposit_mask: string, bank_account_no: string, bank_code: string, bank_trancode: string,
    fill_bank_no: string, from_bank_name: string, from_bank_no: string, method: string, package_id: string, statement_img: string,
    to_bank_branch: string, to_bank_code: string, to_bank_name: string, to_bank_no: string, wallet: number) {
    console.log({ amount_deposit, amount_deposit_mask, bank_account_no, bank_code, bank_trancode, fill_bank_no, from_bank_name, from_bank_no, method, package_id, statement_img, to_bank_branch, to_bank_code, to_bank_name, to_bank_no, wallet });
    return post({
      path: `${API_URL.PAYMENT}/depositbank`,
      data: { amount_deposit, amount_deposit_mask, bank_account_no, bank_code, bank_trancode, fill_bank_no, from_bank_name, from_bank_no, method, package_id, statement_img, to_bank_branch, to_bank_code, to_bank_name, to_bank_no, wallet },
    });
  };

  depositInfoCard() {
    return get({
      path: `${API_URL.PAYMENT}/gwinfo`,
    })
  }
  depositCard(card_status: string, card_code: string, card_serial: string, card_rate: number, card_amount: number, to_telcom_code: string, wallet: number) {
    //console.log({ card_status, card_code, card_serial, card_rate, card_amount, to_telcom_code, wallet });
    return post({
      path: `${API_URL.PAYMENT}/depositcard`,
      data: { card_status, card_code, card_serial, card_rate, card_amount, to_telcom_code, wallet },
    });
  };

  cryptocheck() {
    return get({
      path: `${API_URL.PAYMENT}/cryptocheck`,
    })
  }

  cancelcrypto(id: number) {
    return post({
      path: `${API_URL.PAYMENT}/cancelcrypto`,
      data: { id },
    });
  }

  depositCrypto(currency: string, method: string, package_id: number) {
    //console.log({ currency, method, package_id });
    return post({
      path: `${API_URL.PAYMENT}/cryptopay`,
      data: { currency, method, package_id },
    });
  };

  withdrawbank(amount_withdraw: number, to_bank_code: string, to_bank_name: string, to_bank_no: string, verify_phone: string) {
    //console.log({ amount_withdraw, to_bank_code, to_bank_name, to_bank_no });
    return postData(`${API_URL.PAYMENT}/withdrawbank`, { amount_withdraw, to_bank_code, to_bank_name, to_bank_no, verify_phone });
    // return post({
    //   path: `${API_URL.PAYMENT}/withdrawbank`,
    //   data: { amount_withdraw, to_bank_code, to_bank_name, to_bank_no },
    // });
  };

  withdrawcard(card_amount_unit: number, card_number: number, card_status: number, to_telcom_code: string) {
    // console.log({ card_amount_unit, card_number, card_status, to_telcom_code });
    // return post({
    //   path: `${API_URL.PAYMENT}/withdrawcard`,
    //   data: { card_amount_unit, card_number, card_status, to_telcom_code },
    // });
    return postData(`${API_URL.PAYMENT}/withdrawcard`, { card_amount_unit, card_number, card_status, to_telcom_code });
  };

  getCategory(alias: string) {
    //console.log({ currency, method, package_id });
    return get({
      path: `${API_URL.CATEGORY}?alias=${alias}`,
    });
  };

  getTransactions(start: string, end: string, status: string) {
    return get({
      path: `${API_URL.TRANSACTION}/?page=1&limit=1000&start=${start}&end=${end}&status=${status}`,
    })
  };

  getBetTransactions(start: string, end: string, status: string, limit: number = 10, offset: number = 0) {
    return get({
      path: `${API_URL.BET_TRANSACTION}?page=${offset}&limit=${limit}&start=${start}&end=${end}&status=${status}`,
    })
  };

  getHistoryBet(start: string, end: string, status: string) {
    return get({
      path: `${API_URL.HISTORYBET}/?page=1&limit=1000&start=${start}&end=${end}&status=${status}`,
    })
  }
  getGamesWon() {
    return get({
      path: `${API_URL.STATISTIC}/game/won`,
    })
  }
  getGamesPlayed() {
    return get({
      path: `${API_URL.STATISTIC}/game/played`,
    })
  }

  getUserProfile() {
    return getData({
      path: `api2/lyp/v2/minigame/user/profile`,
    })
  }

  // rewards event
  level() {
    return getData({
      path: `api2/lyp/v2/user/top/level`,
    })
  };
  levels() {
    return getData({
      path: `api2/lyp/v2/minigame/levels`,
    })
  };
  events() {
    return getData({
      path: `api2/v2/events`,
    })
  };

}

export default new Api();
