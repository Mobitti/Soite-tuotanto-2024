/******************************************* Muuttujat **********************************************************************/
let kayttajatunnus = "";
let kirjautunut_kayttaja_id = "";
let kayttaja_toimialue_idt = "";
let kayttaja_sijaisuustausta_idt = "";
let valittu_pvm = "";
let viimeisin_suunniteltuvuoro_pvm = "";
let valittu_suunniteltuvuoro_id = "";
let valittu_rivinumero = "";
let valittu_sijainen_id = "";
let sijaisten_idt = "-1";
let vuoro_tausta_valinnat = "";
let reservi_osasto_valinnat = "";
let reservi_tyomaara_valinnat = "";
let reservi_reservitausta_valinnat = "";
let vuoro_paivitys_ajastin = "";
let sihteeri_osasto_valinnat = "";
let sihteeri_kustannusnumero_valinnat = "";
let sihteeri_tyomaara_valinnat = "";
let sihteeri_alijakso_tyomaara_valinnat = "";
let sihteeri_tausta_valinnat = "";
let sihteeri_alijakso_tausta_valinnat = "";
let suunnittelu_raporttiosasto_valinnat = "";
let suunnittelu_osasto_valinnat = "";
let suunnittelu_tausta_valinnat = "";
let vuorotyyppi_valinnat = "";
let hallinta_tila = "";
let kotiosasto_tausta_id = "";
let vuoropaivitys = false;

let tyyppilista = [];
let sijainenlista = [];
let vuoro_osasto_valinnat = [];
let vuoro_osasto_valinta_tiedot = [];
let suunnittelu_osasto_tiedot = [];
let suunnittelu_osasto_valinta_tiedot = [];
let osasto_varit = [];
let suunnittelu_osasto_varit = [];
let loki_tunniste_suodatin = [];
let loki_tieto_suodatin = [];
let piilotettavat_vuorotyypit = [];
let suunnittelu_vuorotyypit = [];
let suunnittelu_sijaisten_osastot = [];
let suunnittelu_vuoro_vaihto_tiedot = [];
let suunnittelu_toimialueettomat_osastot = [];
let matka_sijaisen_vuorot = {};

let vuoro_alustettu = false;
let suunnittelu_alustettu = false;
let hallinta_alustettu = false;
let loki_alustettu = false;
let raportointi_alustettu = false;
let viestinta_alustettu = false;
let reservinakyma_alustettu = false;
let solu_valittu = false;
let suunnittelu_vuoro_muokkaus_tila = false;
let suunnittelu_kiinnitys_muokkaus_tila = false;
let suunnittelu_vuoro_vaihto_tila = false;
let vuorokustannusvalinta = false;
let reservihallinta = false;
let sihteerihallinta = false;
let hallinta_haku = false;
let haetaan_vuoroja = false;
let siirtotiedostoluonti = false;
let sihteerinakyma_alustettu = false;
let matkanakyma_alustettu = false;
let matkatarkistus_alustettu = false;
let vuorolukitus = false;
let kaikkivuorotyypit = false;
let raportointi_kuukausi_tila = true;

let kayttaja_jarjestysarvo = "tunnus";
let kayttaja_jarjestys = "ASC";
let sijainen_jarjestysarvo = "nimi";
let sijainen_jarjestys = "ASC";
let reservilainen_jarjestysarvo = "nimi";
let reservilainen_jarjestys = "ASC";
let sihteeri_jarjestysarvo = "nimi";
let sihteeri_jarjestys = "ASC";
let nimike_jarjestysarvo = "nimi";
let nimike_jarjestys = "ASC";
let osasto_jarjestysarvo = "raporttinumero";
let osasto_jarjestys = "ASC";
let tyomaara_jarjestysarvo = "prosentti";
let tyomaara_jarjestys = "ASC";
let kustannus_jarjestysarvo = "osasto";
let kustannus_jarjestys = "ASC";
let henkilokustannus_jarjestysarvo = "sijainen";
let henkilokustannus_jarjestys = "ASC";
let kilometrikustannus_jarjestysarvo = "alku_pvm";
let kilometrikustannus_jarjestys = "ASC";
let reservikustannus_jarjestysarvo = "osasto";
let reservikustannus_jarjestys = "ASC";
let reservihenkilokustannus_jarjestysarvo = "reservilainen";
let reservihenkilokustannus_jarjestys = "ASC";
let sihteerikustannus_jarjestysarvo = "alku_pvm";
let sihteerikustannus_jarjestys = "ASC";
let toimialue_jarjestysarvo = "nimi";
let toimialue_jarjestys = "ASC";
let palvelualue_jarjestysarvo = "nimi";
let palvelualue_jarjestys = "ASC";
let sijaisuustausta_jarjestysarvo = "numero";
let sijaisuustausta_jarjestys = "ASC";
let reservitausta_jarjestysarvo = "numero";
let reservitausta_jarjestys = "ASC";
let reservi_jarjestysarvo = "nimi";
let reservi_jarjestys = "ASC";
let vuorotyypit_jarjestysarvo = "tyyppi";
let vuorotyypit_jarjestys = "ASC";
let tulos_jarjestysarvo = "nimi";
let tulos_jarjestys = "ASC";
let matka_jarjestysarvo = "pvm";
let matka_jarjestys = "ASC";
let matkatarkistus_jarjestysarvo = "pvm";
let matkatarkistus_jarjestys = "ASC";

/******************************************* Toiminnot **********************************************************************/

function alusta_sivu() {
	//Alustaa näkymän
	$("button").button();
	$("#kirjautumisnakyma").show();
	$("#latausnakyma").hide();
	$("#aloitusnakyma").removeClass("piilotettu");
	$("#sisaltonakyma").removeClass("piilotettu");
	$("#aloitusnakyma").hide();
	$("#sisaltonakyma").hide();
	$("#tunnus").val("");
	$("#salasana").val("");
	let tanaan = new Date();
	$("#etusivu_otsikko_teksti").html("MOVEON " + tanaan.getFullYear());
	$("#aloitusnakyma_otsikko_teksti").html("MOVEON " + tanaan.getFullYear());

	$("#tunnus").keydown(function (painiketapahtuma) {
		if (painiketapahtuma.which == 13) {
			tarkista_tunnukset();
		}
	});

	$("#salasana").keydown(function (painiketapahtuma) {
		if (painiketapahtuma.which == 13) {
			tarkista_tunnukset();
		}
	});
}

function tarkista_tunnukset() {
	kayttajatunnus = $("#tunnus").val();
	let kayttajasalasana = $("#salasana").val();

	$.post(
		"php/tarkista_tunnukset.php",
		{ tunnus: kayttajatunnus, salasana: kayttajasalasana },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				if (reply == "[]") {
					alert("Tarkista tunnus tai salasana!");
					$("#tunnus").val("");
					$("#salasana").val("");
					return;
				}

				$("#tunnus").val("");
				$("#salasana").val("");

				let replyObj = JSON.parse(reply);
				kayttaja_sijaisuustausta_idt =
					replyObj[0].sijaisuustausta_idt.split(",");
				kayttaja_toimialue_idt = replyObj[0].toimialue_idt;
				kirjautunut_kayttaja_id = replyObj[0].kayttaja_id;
				let tanaan = new Date();
				let paiva = tanaan.getDate();
				let kuukausi = tanaan.getMonth() + 1;

				if (paiva <= 9) {
					paiva = "0" + paiva;
				}
				if (kuukausi <= 9) {
					kuukausi = "0" + kuukausi;
				}

				window.document.title =
					kayttajatunnus +
					" - " +
					paiva +
					"." +
					kuukausi +
					"." +
					tanaan.getFullYear();

				let nakymat = replyObj[0].nakyma_idt.split(",");

				$.post("php/hae_nakyma_valinnat.php", function (reply) {
					if (reply.indexOf("Tietokantavirhe:") == -1) {
						let kayttajanakymat = JSON.parse(reply);

						for (let i = 0; i < nakymat.length; i++) {
							for (let j = 0; j < kayttajanakymat.length; j++) {
								if (nakymat[i] == kayttajanakymat[j].id) {
									switch (kayttajanakymat[j].nimi) {
										case "Vuoronäkymä":
											$("#vuoronakyma_kuvake").removeClass("ei_valittavissa");
											break;

										case "Vuorosuunnittelu":
											$("#vuorosuunnittelu_kuvake").removeClass(
												"ei_valittavissa"
											);
											vuoropaivitys = true;
											break;

										case "Järjestelmänhallinta":
											$("#jarjestelmahallinta_kuvake").removeClass(
												"ei_valittavissa"
											);
											break;

										case "Lokinäkymä":
											$("#loki_kuvake").removeClass("ei_valittavissa");
											break;

										case "Raportointi":
											$("#raportointi_kuvake").removeClass("ei_valittavissa");
											break;

										case "Siirtotiedosto":
											siirtotiedostoluonti = true;
											break;

										case "Kustannusvalinta":
											vuorokustannusvalinta = true;
											break;

										case "Viestintänäkymä":
											$("#viestinta_kuvake").removeClass("ei_valittavissa");
											break;

										case "Reservinäkymä":
											$("#reservinakyma_kuvake").removeClass("ei_valittavissa");
											break;

										case "Reservihallinta":
											reservihallinta = true;
											break;

										case "Sihteerihallinta":
											sihteerihallinta = true;
											break;

										case "Sihteerinäkymä":
											$("#sihteerinakyma_kuvake").removeClass(
												"ei_valittavissa"
											);
											break;

										case "Matkanäkymä":
											$("#matkanakyma_kuvake").removeClass("ei_valittavissa");

											$("#matkapinRuutu").dialog({
												modal: true,
												autoOpen: false,
												width: 650,
												title: "Syötä pin koodi",
												buttons: [
													{
														class: "oikeapainike",
														text: "Ok",
														click: function () {
															matka_tarkista_pin();
														},
													},
													{
														class: "vasenpainike",
														text: "Peruuta",
														click: function () {
															$(this).dialog("close");
														},
													},
												],
											});

											$("#matkapin").keydown(function (painiketapahtuma) {
												if (painiketapahtuma.which == 13) {
													matka_tarkista_pin();
												}
											});
											break;

										case "Matkatarkistus":
											$("#matkatarkistus_kuvake").removeClass(
												"ei_valittavissa"
											);
											break;

										case "Vuorolukitus":
											vuorolukitus = true;
											break;

										case "Vuorotyypit":
											kaikkivuorotyypit = true;
											break;
									}
									break;
								}
							}
						}

						$("#kirjautumisnakyma").hide();
						$("#aloitusnakyma").show();
					} else {
						alert("Tietokantavirhe");
					}
				});
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function nakyma_valinta(valittu_nakyma) {
	if ($("#" + valittu_nakyma).hasClass("ei_valittavissa")) {
		return;
	}

	vuoro_ajastin(false);

	switch (valittu_nakyma) {
		case "vuoronakyma_kuvake":
			aktivoi_vuoronakyma();
			break;
		case "vuorosuunnittelu_kuvake":
			aktivoi_vuorosuunnittelu();
			break;
		case "jarjestelmahallinta_kuvake":
			aktivoi_jarjestelmanhallinta();
			break;
		case "loki_kuvake":
			aktivoi_loki();
			break;
		case "raportointi_kuvake":
			aktivoi_raportointi();
			break;
		case "viestinta_kuvake":
			aktivoi_viestinta();
			break;
		case "reservinakyma_kuvake":
			aktivoi_reservinakyma();
			break;
		case "sihteerinakyma_kuvake":
			aktivoi_sihteerinakyma();
			break;
		case "matkanakyma_kuvake":
			matka_nayta_pin_ruutu();
			break;
		case "matkatarkistus_kuvake":
			aktivoi_matkatarkistus();
			break;
		default:
	}
}

function etusivu() {
	$(".ui-dialog-content").dialog("close");
	$("#latausnakyma").hide();
	$("#sisaltonakyma").hide();
	$("#vuoronakyma").hide();
	$("#suunnittelunakyma").hide();
	$("#hallintanakyma").hide();
	$("#lokinakyma").hide();
	$("#raportointinakyma").hide();
	$("#viestintanakyma").hide();
	$("#reservinakyma").hide();
	$("#sihteerinakyma").hide();
	$("#aloitusnakyma").show();
	$("#matkanakyma").hide();
	$("#matkatarkistus").hide();

	if (!$(".dhx_year_tooltip").hasClass("piilotettu")) {
		$(".dhx_year_tooltip").addClass("piilotettu");
	}
}

function kirjaudu_ulos() {
	window.location = "index.html";
}

function aktivoi_vuoronakyma() {
	$("#aloitusnakyma").hide();
	$(".kehys").hide();
	$("#sisaltonakyma").show();
	$("#latausnakyma").show();

	alusta_vuoronakyma();

	setTimeout(function () {
		$("#latausnakyma").hide();
		$("#vuoronakyma").show();
	}, 1000);
}

function aktivoi_vuorosuunnittelu() {
	$("#aloitusnakyma").hide();
	$(".kehys").hide();
	$("#sisaltonakyma").show();
	$("#latausnakyma").show();

	alusta_vuorosuunnittelu();

	setTimeout(function () {
		$("#latausnakyma").hide();
		$("#suunnittelunakyma").show();
		scheduler.updateView();
		$("#vuorokalenteri").focus();
	}, 1000);
}

function aktivoi_jarjestelmanhallinta() {
	$("#aloitusnakyma").hide();
	$(".kehys").hide();
	$("#sisaltonakyma").show();
	$("#latausnakyma").show();

	alusta_jarjestelmanhallinta();

	setTimeout(function () {
		$("#latausnakyma").hide();
		$("#hallintanakyma").show();
	}, 1000);
}

function aktivoi_loki() {
	$("#aloitusnakyma").hide();
	$(".kehys").hide();
	$("#sisaltonakyma").show();
	$("#latausnakyma").show();

	alusta_loki();

	setTimeout(function () {
		$("#latausnakyma").hide();
		$("#lokinakyma").show();
	}, 1000);
}

function aktivoi_raportointi() {
	$("#aloitusnakyma").hide();
	$(".kehys").hide();
	$("#sisaltonakyma").show();
	$("#latausnakyma").show();

	alusta_raportointi();

	setTimeout(function () {
		$("#latausnakyma").hide();
		$("#raportointinakyma").show();
	}, 1000);
}

function aktivoi_viestinta() {
	$("#aloitusnakyma").hide();
	$(".kehys").hide();
	$("#sisaltonakyma").show();
	$("#latausnakyma").show();

	alusta_viestinta();

	setTimeout(function () {
		$("#latausnakyma").hide();
		$("#viestintanakyma").show();
	}, 1000);
}

function aktivoi_reservinakyma() {
	$("#aloitusnakyma").hide();
	$(".kehys").hide();
	$("#sisaltonakyma").show();
	$("#latausnakyma").show();

	alusta_reservinakyma();

	setTimeout(function () {
		$("#latausnakyma").hide();
		$("#reservinakyma").show();
	}, 1000);
}

function aktivoi_sihteerinakyma() {
	$("#aloitusnakyma").hide();
	$(".kehys").hide();
	$("#sisaltonakyma").show();
	$("#latausnakyma").show();

	alusta_sihteerinakyma();

	setTimeout(function () {
		$("#latausnakyma").hide();
		$("#sihteerinakyma").show();
	}, 1000);
}

function aktivoi_matkanakyma() {
	$("#aloitusnakyma").hide();
	$(".kehys").hide();
	$("#sisaltonakyma").show();
	$("#latausnakyma").show();

	alusta_matkanakyma();

	setTimeout(function () {
		$("#latausnakyma").hide();
		$("#matkanakyma").show();
	}, 1000);
}

function aktivoi_matkatarkistus() {
	$("#aloitusnakyma").hide();
	$(".kehys").hide();
	$("#sisaltonakyma").show();
	$("#latausnakyma").show();

	alusta_matkatarkistus();

	setTimeout(function () {
		$("#latausnakyma").hide();
		$("#matkatarkistus").show();
	}, 1000);
}

function nayta_tilaviesti(viesti) {
	$("#tilaTeksti").html(viesti);
	$("#tilaTeksti").fadeIn(2000, function () {
		$("#tilaTeksti").fadeOut(4000);
	});
}

/******************* VUORONÄKYMÄ **********************************/
function alusta_vuoronakyma() {
	if (!vuoro_alustettu) {
		//Kalenterin alustus
		$("#pvmHaku").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (dateText, inst) {
				vuoro_hae_vuorot();
				vuoro_hae_paivan_viesti();
			},
		});

		$("#pvmHaku").val("");

		//Vuorotyyppiruudun alustus;
		$("#vuoroseliteRuutu").dialog({
			autoOpen: false,
			width: 450,
			height: 450,
			title: "Työvuoroissa käytetyt lyhenteet",
			buttons: [
				{
					class: "keskipainike",
					text: "Ok",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Päivänviestiruudun alustus;
		$("#paivanviestiruutu").dialog({
			autoOpen: false,
			width: 450,
			title: "Päivän viesti",
			buttons: [
				{
					class: "oikeapainike",
					text: "Päivitä",
					click: function () {
						vuoro_aseta_paivan_viesti();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa latausruudun
		$("#vuorolatausRuutu").dialog({
			modal: true,
			autoOpen: false,
			title: "Haetaan vuoroja...",
			width: 350,
			dialogClass: "ei_sulku_painiketta",
		});

		//Alustaa hakusanakentän ja lisää enter näppäimen kuuntelun
		$("#hakusana").val("");

		$("#hakusana").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 13) {
				vuoro_hae_vuorot();
			}
		});

		$("#viestiruutu_iso").on("input", function () {
			$("#viestiruutu_iso").css("background-color", "yellow");
		});

		$("#vuorotoimialuesuodatin").change(function () {
			vuoro_hae_vuorot();
			vuoro_hae_paivan_viesti();
		});

		$(".vuoro_pvmpainike").button("option", "disabled", false);

		$("#vuoronakymavalinta").change(function () {
			vuoro_hae_vuorot();
		});

		vuoro_alustettu = true;
	}

	$("#vuorotoimialuesuodatin").html("");
	$("#vuorotoimialuepikavalinnat").html("");
	$("#vuorotauludata").html("");
	$("#hakusana").val("");
	$("#vuoro_maara").html("");
	$("#vuoro_viestinakyma").hide();
	$("#hakuvalikko").val("nimi");
	$("#viestiruutu").val("");
	$(".vuoro_pvmpainike").button("option", "disabled", false);
	$("#vuoro_paivitys_aika").html("");

	if (!vuoropaivitys) {
		$("#vuoropaivityskytkinkehys").hide();
	}

	$.when(
		vuoro_hae_vuorotyypit(),
		vuoro_hae_osasto_valinnat(),
		vuoro_hae_tausta_valinnat(),
		vuoro_hae_toimialue_valinnat()
	).then(function () {
		if (suunnittelu_alustettu) {
			$("#vuoronakymavalinta").val($("#suunnittelu_nakyma_suodatin").val());
			$("#vuoro_nakymaasetukset button").removeClass("painike_valittu_tila");
			if ($("#suunnittelu_nakyma_suodatin").val() == 1) {
				$("#vuoronakymapikavalinta_hoitaja").addClass("painike_valittu_tila");
			} else {
				$("#vuoronakymapikavalinta_sihteeri").addClass("painike_valittu_tila");
			}

			if (viimeisin_suunniteltuvuoro_pvm != "") {
				$("#pvmHaku").datepicker("setDate", viimeisin_suunniteltuvuoro_pvm);
			} else {
				$("#pvmHaku").datepicker("setDate", new Date());
			}
		} else {
			//Asettaa hoitajanäkymän
			$("#vuoronakymavalinta").val(1);
			$("#vuoronakymapikavalinta_hoitaja").addClass("painike_valittu_tila");
			$("#pvmHaku").datepicker("setDate", new Date());
		}

		vuoro_hae_paivan_viesti();
		vuoro_ajastin(true);
		vuoro_hae_vuorot();
	});
}

function vuoro_ajastin(kaynnissa) {
	if (kaynnissa) {
		if (
			$("#vuoropaivityskytkin").data("aktiivinen") == 1 &&
			vuoro_paivitys_ajastin == null
		) {
			vuoro_paivitys_ajastin = setTimeout(function () {
				vuoro_ajastin(true);
				vuoro_hae_vuorot();
			}, 900000); //15min
		}
	} else {
		clearTimeout(vuoro_paivitys_ajastin);
		vuoro_paivitys_ajastin = null;
	}
}

function aseta_vuoropaivitys() {
	if ($("#vuoropaivityskytkin").data("aktiivinen") == 0) {
		$("#vuoropaivityskytkin").data("aktiivinen", "1");
		$("#vuoropaivityskytkin")
			.removeClass("kytkinkehys_ei_aktiivinen")
			.addClass("kytkinkehys_aktiivinen");
		$("#vuoropaivityskytkin")
			.find(".kytkinvipu")
			.removeClass("kytkinvipu_ei_aktiivinen")
			.addClass("kytkinvipu_aktiivinen");
		vuoro_ajastin(true);
		vuoro_hae_vuorot();
	} else {
		$("#vuoropaivityskytkin").data("aktiivinen", "0");
		$("#vuoropaivityskytkin")
			.removeClass("kytkinkehys_aktiivinen")
			.addClass("kytkinkehys_ei_aktiivinen");
		$("#vuoropaivityskytkin")
			.find(".kytkinvipu")
			.removeClass("kytkinvipu_aktiivinen")
			.addClass("kytkinvipu_ei_aktiivinen");
		vuoro_ajastin(false);
	}
}

function vuoro_seuraavaPvm() {
	if (
		$.datepicker.formatDate("dd.mm.yy", $("#pvmHaku").datepicker("getDate")) !=
		""
	) {
		let date = $("#pvmHaku").datepicker("getDate");
		date.setDate(date.getDate() + 1);
		$("#pvmHaku").datepicker("setDate", date);
		vuoro_hae_vuorot();
		vuoro_hae_paivan_viesti();
		$("#viestiruutu").css("background-color", "white");
	}
}

function vuoro_edellinenPvm() {
	if (
		$.datepicker.formatDate("dd.mm.yy", $("#pvmHaku").datepicker("getDate")) !=
		""
	) {
		let date = $("#pvmHaku").datepicker("getDate");
		date.setDate(date.getDate() - 1);
		$("#pvmHaku").datepicker("setDate", date);
		vuoro_hae_vuorot();
		vuoro_hae_paivan_viesti();
		$("#viestiruutu").css("background-color", "white");
	}
}

function vuoro_nayta_vuoroselite_ruutu() {
	$("#vuoroseliteRuutu").dialog("open");
}

function vuoro_hae_vuorotyypit() {
	let vuorotyypit = "";
	piilotettavat_vuorotyypit = [];
	let valmis = $.Deferred();
	$.post("php/hae_vuorotyyppi_tiedot.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			$("#vuoroselitetiedot").html(
				"<tr>" + "<td>#</td>" + "<td>Poissaolo</td>" + "</tr>"
			);

			for (let i = 0; i < replyObj.length; i++) {
				let vuorotyyppiteksti = replyObj[i].vuorotyyppi;

				$("#vuoroselitetiedot").append(
					"<tr>" +
						"<td>" +
						vuorotyyppiteksti +
						"</td>" +
						"<td>" +
						replyObj[i].kuvaus +
						"</td>" +
						"</tr>"
				);

				if (replyObj[i].vuoronakymassa == 0) {
					piilotettavat_vuorotyypit.push(replyObj[i].vuorotyyppi);
				}
			}
		} else {
			alert("Tietokantavirhe");
		}

		valmis.resolve("Vuorotyypit");
	});

	return valmis;
}

function vuoro_vaihda_nakyma(hoitajatila) {
	$("#vuoro_nakymaasetukset button").removeClass("painike_valittu_tila");
	if (hoitajatila) {
		$("#vuoronakymavalinta").val(1).change();
		$("#vuoronakymapikavalinta_hoitaja").addClass("painike_valittu_tila");
	} else {
		$("#vuoronakymavalinta").val(0).change();
		$("#vuoronakymapikavalinta_sihteeri").addClass("painike_valittu_tila");
	}
}

function vuoro_hae_toimialue_valinnat() {
	$("#vuorotoimialuesuodatin").html("");
	$("#vuorotoimialuepikavalinnat").html(
		"<button id='vuorotoimialuevalinta_0' class='toimialuepainike'>Kaikki</button>"
	);

	$("#vuorotoimialuevalinta_0").click(function () {
		$("#vuorotoimialuepikavalinnat button").removeClass("painike_valittu_tila");
		$(this).addClass("painike_valittu_tila");
		$("#vuorotoimialuesuodatin option").prop("selected", "selected");
		vuoro_hae_vuorot();
		vuoro_hae_paivan_viesti();
	});

	let valmis = $.Deferred();

	$.post(
		"php/hae_toimialue_valinnat.php",
		{ toimialue_idt: kayttaja_toimialue_idt },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);

				for (let i = 0; i < replyObj.length; i++) {
					$("#vuorotoimialuepikavalinnat").append(
						"<button id='vuorotoimialuevalinta_" +
							replyObj[i].id +
							"' class='toimialuepainike'>" +
							replyObj[i].lyhenne +
							"</button>"
					);
					$("#vuorotoimialuesuodatin").append(
						"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].nimi +
							"</option>"
					);

					$("#vuorotoimialuevalinta_" + replyObj[i].id).click(function (
						painiketapahtuma
					) {
						let toimialue_id = $(this)
							.prop("id")
							.replace("vuorotoimialuevalinta_", "");
						let valitut_toimialue_idt = $("#vuorotoimialuesuodatin").val();

						if (
							$("#vuorotoimialuevalinta_0").hasClass("painike_valittu_tila") &&
							$("#vuorotoimialuesuodatin option").length ==
								valitut_toimialue_idt.length
						) {
							$("#vuorotoimialuepikavalinnat button").removeClass(
								"painike_valittu_tila"
							);
							$("#vuorotoimialuesuodatin").val(toimialue_id).change();
							$(this).addClass("painike_valittu_tila");
						} else {
							if (painiketapahtuma.ctrlKey == true) {
								if ($(this).hasClass("painike_valittu_tila")) {
									if (
										$("#vuorotoimialuepikavalinnat .painike_valittu_tila")
											.length > 1
									) {
										$(this).removeClass("painike_valittu_tila");
										if (valitut_toimialue_idt.indexOf(toimialue_id) >= 0) {
											valitut_toimialue_idt.splice(
												valitut_toimialue_idt.indexOf(toimialue_id),
												1
											);
										}
										$("#vuorotoimialuesuodatin")
											.val(valitut_toimialue_idt)
											.change();
									}
								} else {
									valitut_toimialue_idt.push(toimialue_id);
									$("#vuorotoimialuesuodatin")
										.val(valitut_toimialue_idt)
										.change();
									if (
										$("#vuorotoimialuesuodatin option").length ==
										valitut_toimialue_idt.length
									) {
										$("#vuorotoimialuepikavalinnat button").removeClass(
											"painike_valittu_tila"
										);
										$("#vuorotoimialuevalinta_0").addClass(
											"painike_valittu_tila"
										);
									} else {
										$(this).addClass("painike_valittu_tila");
									}
								}
							} else {
								$("#vuorotoimialuepikavalinnat button").removeClass(
									"painike_valittu_tila"
								);
								$("#vuorotoimialuesuodatin").val(toimialue_id).change();
								$(this).addClass("painike_valittu_tila");
							}
						}
					});
				}

				$("#vuorotoimialuepikavalinnat button").button();

				if (suunnittelu_alustettu) {
					$("#vuorotoimialuesuodatin").val(
						$("#suunnittelu_toimialue_suodatin").val()
					);
					let valitut_toimialueet = $("#suunnittelu_toimialue_suodatin").val();

					if (
						valitut_toimialueet.length ==
						$("#vuorotoimialuesuodatin option").length
					) {
						$("#vuorotoimialuepikavalinnat button").removeClass(
							"painike_valittu_tila"
						);
						$("#vuorotoimialuevalinta_0").addClass("painike_valittu_tila");
					} else {
						for (let i = 0; i < valitut_toimialueet.length; i++) {
							$("#vuorotoimialuevalinta_" + valitut_toimialueet[i]).addClass(
								"painike_valittu_tila"
							);
						}
					}
				} else {
					$("#vuorotoimialuevalinta_0").addClass("painike_valittu_tila");
					$("#vuorotoimialuesuodatin option").prop("selected", "selected");
				}
			} else {
				alert("Tietokantavirhe");
			}

			valmis.resolve("Toimialuevalinnat");
		}
	);
	return valmis;
}

function vuoro_aseta_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == tulos_jarjestysarvo) {
		if (tulos_jarjestys == "DESC") {
			tulos_jarjestys = "ASC";
		} else {
			tulos_jarjestys = "DESC";
		}
	} else {
		tulos_jarjestysarvo = jarjestysarvo;
		tulos_jarjestys = "ASC";
	}

	vuoro_hae_vuorot();
}

function vuoro_hae_vuorot() {
	if (haetaan_vuoroja) {
		return;
	}
	if (
		$.datepicker.formatDate("dd.mm.yy", $("#pvmHaku").datepicker("getDate")) ==
		""
	) {
		return;
	}

	$("#vuorolatausRuutu").dialog("open");
	$(".vuoro_pvmpainike").button("option", "disabled", true);
	let vuorot_pvm = $.datepicker.formatDate(
		"dd.mm.yy",
		$("#pvmHaku").datepicker("getDate")
	);
	let h_hakusana = $("#hakusana").val();
	let h_arvo = $("#hakuvalikko option:selected").val();
	let valitut_toimialueet = $("#vuorotoimialuesuodatin").val();
	let vuoro_tila = $("#vuoronakymavalinta").val();
	haetaan_vuoroja = true;
	let oikeudet = 0;
	if (vuorokustannusvalinta) {
		oikeudet = 1;
	}

	$.post(
		"php/hae_vuorot.php",
		{
			pvm: vuorot_pvm,
			hoitajatila: vuoro_tila,
			toimialue_idt: valitut_toimialueet,
			hakusana: h_hakusana,
			haettavaarvo: h_arvo,
			jarjestys: tulos_jarjestys,
			jarjestettavaarvo: tulos_jarjestysarvo,
			muokkausoikeudet: oikeudet,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				$("#vuorolatausRuutu").dialog("close");
				$(".vuoro_pvmpainike").button("option", "disabled", false);
				haetaan_vuoroja = false;
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						$(".vuoro_pvmpainike").button("option", "disabled", false);
						$("#vuorolatausRuutu").dialog("close");
						haetaan_vuoroja = false;
						alert("Parametrivirhe");
						break;

					default:
						let palvelinvastaus = JSON.parse(reply);
						$("#vuorotauludata").html("");

						let vuoromaara = palvelinvastaus["vuoromaara"];
						if (vuoromaara > 0) {
							if (vuoromaara == 1) {
								$("#vuoro_maara").html(vuoromaara + " vuoro");
							} else {
								$("#vuoro_maara").html(vuoromaara + " vuoroa");
							}
						} else {
							$("#vuorotauludata").append(
								"<tr>" +
									"<td colspan='10'><span>Ei vuoroja</span></td>" +
									"</tr>"
							);
							$("#vuoro_maara").html("Ei vuoroja");
						}

						let viive = 100;
						if (vuoromaara > 50) {
							viive = 50;
						}

						let osasto_valinnat =
							"<option value='0' style='background-color:#ffffff'></option>";
						$.each(vuoro_osasto_valinta_tiedot, function (avain, arvo) {
							osasto_valinnat += vuoro_osasto_valinta_tiedot[avain];
						});

						const sijaistentiedot = palvelinvastaus["sijaistiedot"];
						let sijaisten_osasto_valinta_tiedot = [];
						$.each(sijaistentiedot, function (avain, arvo) {
							let osasto_idt = sijaistentiedot[avain].osasto_idt.split(",");
							for (let j = 0; j < osasto_idt.length; j++) {
								if (
									Object.keys(vuoro_osasto_valinnat).indexOf(osasto_idt[j]) !=
									-1
								) {
									let osasto_tiedot = vuoro_osasto_valinnat[osasto_idt[j]];
									let aktiivinen = "";
									if (osasto_tiedot.aktiivinen == 0) {
										aktiivinen = " disabled";
									}
									const valinta =
										"<option value='" +
										osasto_tiedot.id +
										"' style='background-color:" +
										osasto_tiedot.taustavari +
										"'" +
										aktiivinen +
										">" +
										osasto_tiedot.raporttinumero +
										" " +
										osasto_tiedot.lyhenne +
										"</option>";

									if (
										Object.keys(sijaisten_osasto_valinta_tiedot).indexOf(
											avain
										) != -1
									) {
										sijaisten_osasto_valinta_tiedot[avain] += valinta;
									} else {
										sijaisten_osasto_valinta_tiedot[avain] = valinta;
									}
								}
							}
						});

						for (let i = 0; i < palvelinvastaus["vuorot"].length; i++) {
							let id = palvelinvastaus["vuorot"][i].id;
							let sijainen_id = palvelinvastaus["vuorot"][i].sijainen_id;

							let valinta_luku = "";
							let kentta_luku = "";
							if (
								!vuorokustannusvalinta &&
								palvelinvastaus["vuorot"][i].luku == 1
							) {
								valinta_luku = "disabled";
								kentta_luku = "disabled";
							}

							let vuorolukituskuvake = "";
							if (vuorolukitus) {
								if (palvelinvastaus["vuorot"][i].luku == 1) {
									vuorolukituskuvake =
										"<div id='vuoro_lukitus_" +
										id +
										"' class='vuorolukituskuvake vuorolukituskuvake_lukittu'></div>";
								} else {
									vuorolukituskuvake =
										"<div id='vuoro_lukitus_" +
										id +
										"' class='vuorolukituskuvake vuorolukituskuvake_avattu'></div>";
								}
							}

							let laakelupa = "Lääkl-";
							if (sijaistentiedot[sijainen_id].laakelupa == 1) {
								laakelupa = "Lääkl+";
							}

							let naytettava_vuorotyyppi =
								palvelinvastaus["vuorot"][i].vuorotyyppi;
							if (!kaikkivuorotyypit) {
								if (
									piilotettavat_vuorotyypit.indexOf(naytettava_vuorotyyppi) !=
									-1
								) {
									naytettava_vuorotyyppi = "#";
								}
							}

							$("#vuorotauludata").append(
								"<tr id='vuoro_rivi_" +
									id +
									"' style='display:none'>" +
									"<td class='teksti_vasen'><span id='vuoro_nimi_" +
									id +
									"'>" +
									sijaistentiedot[sijainen_id].nimi +
									"</span></td>" +
									"<td class='teksti_keskella'><span id='vuoro_nimike_" +
									id +
									"'>" +
									sijaistentiedot[sijainen_id].nimike +
									"</span></td>" +
									"<td class='teksti_keskella'><span id='vuoro_kotiosasto_" +
									id +
									"'>" +
									sijaistentiedot[sijainen_id].kotiosasto +
									"</span></td>" +
									"<td class='teksti_vasen'><span id='vuoro_muutosastot_" +
									id +
									"'>" +
									sijaistentiedot[sijainen_id].muut_osastot +
									"</span></td>" +
									"<td class='teksti_vasen'><span id='vuoro_kommentti_" +
									id +
									"'>" +
									sijaistentiedot[sijainen_id].kommentti +
									"</span></td>" +
									"<td class='teksti_keskella'><span id='vuoro_iv_" +
									id +
									"'>" +
									sijaistentiedot[sijainen_id].iv +
									"</span></td>" +
									"<td class='teksti_keskella'><span id='vuoro_laakelupa_" +
									id +
									"'>" +
									laakelupa +
									"</span></td>" +
									"<td class='teksti_keskella'><span id='vuoro_tyyppi_" +
									id +
									"' data-vuorotyyppi='" +
									palvelinvastaus["vuorot"][i].vuorotyyppi +
									"'>" +
									naytettava_vuorotyyppi +
									"</span></td>" +
									"<td>" +
									"<select id='vuoro_raportti_osastoid_" +
									id +
									"' class='vuoro_raporttiosastovalinta' " +
									valinta_luku +
									" title='Raporttiosasto'></select>" +
									"<select id='vuoro_osastoid_" +
									id +
									"' class='vuoro_osastovalinta' " +
									valinta_luku +
									" title='Sijaisuusosasto'></select>" +
									vuorolukituskuvake +
									"</td>" +
									"<td>" +
									"<select id='vuoro_taustaid_" +
									id +
									"' class='vuoro_taustavalinta' " +
									valinta_luku +
									" title='Sijaisuustausta'></select>" +
									"<input id='vuoro_taustakommentti_" +
									id +
									"' class='vuoro_taustakentta' " +
									kentta_luku +
									" title='Kommentti'/>" +
									"<span id='vuoro_taustakommentti_teksti_" +
									id +
									"' class='piilotettu'>" +
									palvelinvastaus["vuorot"][i].tausta_kommentti +
									"</span>" +
									"</td>" +
									"</tr>"
							);

							$("#vuoro_rivi_" + id).click(function () {
								if (!$(this).hasClass("valittu_vuoro_rivi")) {
									let id = $(this).prop("id").replace("vuoro_rivi_", "");
									$(".valittu_vuoro_rivi").css({
										"background-color": "",
										color: "white",
									});
									$(".valittu_vuoro_rivi").removeClass("valittu_vuoro_rivi");
									$(".vuorolukituskuvake").hide();
									$("#vuoro_lukitus_" + id).show();

									$(this).addClass("valittu_vuoro_rivi");
									$("#vuoro_rivi_" + id).css({
										"background-color": "#91ed50",
										color: "black",
									});
									setTimeout(function () {
										$("#vuoro_rivi_" + id).removeClass("valittu_vuoro_rivi");
										$("#vuoro_rivi_" + id).css({
											"background-color": "",
											color: "white",
										});
									}, 60000);

									vuoro_hae_vuoro(id);
								}
							});

							if (!vuorokustannusvalinta) {
								$("#vuoro_raportti_osastoid_" + id).css("display", "none");
							}

							if (vuorolukitus) {
								$("#vuoro_lukitus_" + id).data(
									"lukitus",
									palvelinvastaus["vuorot"][i].luku
								);
								$("#vuoro_lukitus_" + id).hide();
								$("#vuoro_lukitus_" + id).click(function (painiketoiminta) {
									painiketoiminta.stopPropagation();
									let vuoro_id = $(this)
										.prop("id")
										.replace("vuoro_lukitus_", "");
									vuoro_paivita_vuoron_tila(vuoro_id);
								});
							}

							$("#vuoro_raportti_osastoid_" + id).html(osasto_valinnat);
							$("#vuoro_raportti_osastoid_" + id).prop("selectedIndex", 0);
							$("#vuoro_raportti_osastoid_" + id).val(
								palvelinvastaus["vuorot"][i].raportti_osasto_id
							);

							if (palvelinvastaus["vuorot"][i].raportti_osasto_id != 0) {
								$("#vuoro_raportti_osastoid_" + id).css(
									"background-color",
									osasto_varit[palvelinvastaus["vuorot"][i].raportti_osasto_id]
								);
							} else {
								$("#vuoro_raportti_osastoid_" + id).css(
									"background-color",
									"#ffffff"
								);
							}

							$("#vuoro_raportti_osastoid_" + id).change(function () {
								let id = $(this)
									.prop("id")
									.replace("vuoro_raportti_osastoid_", "");
								vuoro_aseta_raporttiosasto(id);
								let valittu_arvo = $("#vuoro_raportti_osastoid_" + id).val();
								if (valittu_arvo != 0) {
									$("#vuoro_raportti_osastoid_" + id).css(
										"background-color",
										osasto_varit[valittu_arvo]
									);
								} else {
									$("#vuoro_raportti_osastoid_" + id).css(
										"background-color",
										"#ffffff"
									);
								}
							});

							$("#vuoro_osastoid_" + id).html(
								"<option value='0' style='background-color:#ffffff'></option>"
							);
							$("#vuoro_osastoid_" + id).append(vuoro_osasto_valinta_tiedot[0]);
							$("#vuoro_osastoid_" + id).append(
								sijaisten_osasto_valinta_tiedot[sijainen_id]
							);

							$("#vuoro_osastoid_" + id).prop("selectedIndex", 0);
							$("#vuoro_osastoid_" + id).val(
								palvelinvastaus["vuorot"][i].osasto_id
							);

							if (palvelinvastaus["vuorot"][i].osasto_id != 0) {
								$("#vuoro_osastoid_" + id).css(
									"background-color",
									osasto_varit[palvelinvastaus["vuorot"][i].osasto_id]
								);
							} else {
								$("#vuoro_osastoid_" + id).css("background-color", "#ffffff");
							}

							$("#vuoro_osastoid_" + id).change(function () {
								let id = $(this).prop("id").replace("vuoro_osastoid_", "");
								vuoro_aseta_osasto(id);
								let osasto_valinta = $(
									"#vuoro_osastoid_" + id + " option:selected"
								).val();
								if (
									$("#vuoro_raportti_osastoid_" + id).val() != osasto_valinta
								) {
									$("#vuoro_raportti_osastoid_" + id)
										.val(osasto_valinta)
										.change();
								}

								let valittu_arvo = $("#vuoro_osastoid_" + id).val();
								if (valittu_arvo != 0) {
									$("#vuoro_osastoid_" + id).css(
										"background-color",
										osasto_varit[valittu_arvo]
									);
								} else {
									$("#vuoro_osastoid_" + id).css("background-color", "#ffffff");
								}
							});

							$("#vuoro_taustaid_" + id).html("");
							$("#vuoro_taustaid_" + id).append(vuoro_tausta_valinnat);
							$("#vuoro_taustaid_" + id).prop("selectedIndex", 0);
							$("#vuoro_taustaid_" + id).val(
								palvelinvastaus["vuorot"][i].tausta_id
							);

							if (
								palvelinvastaus["vuorot"][i].tausta_id == kotiosasto_tausta_id
							) {
								$("#vuoro_taustaid_" + id).css("background-color", "#90ff7c");
							} else {
								$("#vuoro_taustaid_" + id).css("background-color", "#ffffff");
							}

							$("#vuoro_taustaid_" + id).change(function () {
								let v_id = $(this).prop("id").replace("vuoro_taustaid_", "");
								let valittu_arvo = $("#vuoro_taustaid_" + v_id).val();
								if (valittu_arvo == kotiosasto_tausta_id) {
									$("#vuoro_taustaid_" + v_id).css(
										"background-color",
										"#90ff7c"
									);
								} else {
									$("#vuoro_taustaid_" + v_id).css(
										"background-color",
										"#ffffff"
									);
								}

								vuoro_aseta_sijaisuustausta(v_id);
							});

							$("#vuoro_taustakommentti_" + id).val(
								palvelinvastaus["vuorot"][i].tausta_kommentti
							);
							$("#vuoro_taustakommentti_" + id).keydown(function (
								painiketapahtuma
							) {
								if (painiketapahtuma.which == 13) {
									vuoro_aseta_sijaisuustausta_kommentti(
										$(this).prop("id").replace("vuoro_taustakommentti_", "")
									);
								}
							});

							let l = i;

							$("#vuoro_rivi_" + id)
								.delay(l++ * viive)
								.fadeIn(1000);
						}

						setTimeout(function () {
							$("#vuorolatausRuutu").dialog("close");
							$(".vuoro_pvmpainike").button("option", "disabled", false);
						}, vuoromaara * viive);

						let nyt = new Date();
						let nyt_tunnit = nyt.getHours();
						let nyt_minuutit = nyt.getMinutes();

						if (nyt_tunnit <= 9) {
							nyt_tunnit = "0" + nyt_tunnit;
						}
						if (nyt_minuutit <= 9) {
							nyt_minuutit = "0" + nyt_minuutit;
						}

						let seuraava = new Date(nyt.getTime() + 15 * 60 * 1000);
						let seuraava_tunnit = seuraava.getHours();
						let seuraava_minuutit = seuraava.getMinutes();

						if (seuraava_tunnit <= 9) {
							seuraava_tunnit = "0" + seuraava_tunnit;
						}
						if (seuraava_minuutit <= 9) {
							seuraava_minuutit = "0" + seuraava_minuutit;
						}
						$("#vuoro_paivitys_aika").html(
							"(Haettu: " + nyt_tunnit + ":" + nyt_minuutit + ")"
						);

						haetaan_vuoroja = false;
				}
			}
		}
	);
}

function vuoro_paivita_vuoron_tila(v_id) {
	let v_lukitus = 0;
	let lukitus = $("#vuoro_lukitus_" + v_id).data("lukitus");
	if (lukitus == 0) {
		v_lukitus = 1;
	}

	let v_tyyppi = $("#vuoro_tyyppi_" + v_id).data("vuorotyyppi");
	let v_nakyma = "Vuoronäkymä";

	$.post(
		"php/aseta_lukitus.php",
		{
			id: v_id,
			lukitus: v_lukitus,
			tyyppi: v_tyyppi,
			tunnus: kayttajatunnus,
			nakyma: v_nakyma,
		},
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				if (replyObj[0] > 0) {
					vuoro_hae_vuoro(v_id);
				} else {
					nayta_tilaviesti("Vuoro vanhentunut, haetaan vuorot");
					vuoro_hae_vuorot();
				}
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function vuoro_hae_vuoro(v_id) {
	$.post("php/hae_vuoro.php", { id: v_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);

			let raportti_osasto_id = $(
				"#vuoro_raportti_osastoid_" + v_id + " option:selected"
			).val();
			let osasto_id = $("#vuoro_osastoid_" + v_id + " option:selected").val();
			let tausta_id = $("#vuoro_taustaid_" + v_id + " option:selected").val();
			let tausta_kommentti = $("#vuoro_taustakommentti_" + v_id).val();
			let luku = replyObj[0].luku;

			if (
				raportti_osasto_id != replyObj[0].raportti_osasto_id ||
				osasto_id != replyObj[0].osasto_id ||
				tausta_id != replyObj[0].tausta_id ||
				tausta_kommentti != replyObj[0].tausta_kommentti
			) {
				$("#vuoro_raportti_osastoid_" + v_id).val(
					replyObj[0].raportti_osasto_id
				);
				$("#vuoro_osastoid_" + v_id).val(replyObj[0].osasto_id);
				$("#vuoro_taustaid_" + v_id).val(replyObj[0].tausta_id);
				$("#vuoro_taustakommentti_" + v_id).val(replyObj[0].tausta_kommentti);

				$("#vuoro_rivi_" + v_id)
					.fadeOut(500)
					.fadeIn(500);
				nayta_tilaviesti("Päivitetään vuoron tiedot");
			}

			if (!vuorokustannusvalinta && luku == 1) {
				$("#vuoro_raportti_osastoid_" + v_id).prop("disabled", true);
				$("#vuoro_osastoid_" + v_id).prop("disabled", true);
				$("#vuoro_taustaid_" + v_id).prop("disabled", true);
				$("#vuoro_taustakommentti_" + v_id).prop("disabled", true);
			} else {
				$("#vuoro_raportti_osastoid_" + v_id).prop("disabled", false);
				$("#vuoro_osastoid_" + v_id).prop("disabled", false);
				$("#vuoro_taustaid_" + v_id).prop("disabled", false);
				$("#vuoro_taustakommentti_" + v_id).prop("disabled", false);
			}

			if (vuorolukitus) {
				$("#vuoro_lukitus_" + v_id).removeClass(
					"vuorolukituskuvake_lukittu vuorolukituskuvake_avattu"
				);

				if (luku == 1) {
					$("#vuoro_lukitus_" + v_id).addClass("vuorolukituskuvake_lukittu");
					$("#vuoro_lukitus_" + v_id).data("lukitus", 1);
				} else {
					$("#vuoro_lukitus_" + v_id).addClass("vuorolukituskuvake_avattu");
					$("#vuoro_lukitus_" + v_id).data("lukitus", 0);
				}
			}
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function vuoro_hae_osasto_valinnat() {
	vuoro_osasto_valinta_tiedot = [];
	vuoro_osasto_valinnat = [];
	osasto_varit = [];
	let valmis = $.Deferred();

	$.post(
		"php/hae_osasto_valinnat.php",
		{ jarjestys: "lyhenne" },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);

				for (let i = 0; i < replyObj.length; i++) {
					osasto_varit[replyObj[i].id] = replyObj[i].taustavari;
					vuoro_osasto_valinnat[replyObj[i].id] = replyObj[i];
					let aktiivinen = "";
					if (replyObj[i].aktiivinen == 0) {
						aktiivinen = " disabled";
					}

					if (
						Object.keys(vuoro_osasto_valinta_tiedot).indexOf(
							replyObj[i].toimialue_id
						) != -1
					) {
						vuoro_osasto_valinta_tiedot[replyObj[i].toimialue_id] +=
							"<option value='" +
							replyObj[i].id +
							"' style='background-color:" +
							replyObj[i].taustavari +
							"'" +
							aktiivinen +
							">" +
							replyObj[i].raporttinumero +
							" " +
							replyObj[i].lyhenne +
							"</option>";
					} else {
						vuoro_osasto_valinta_tiedot[replyObj[i].toimialue_id] =
							"<option value='" +
							replyObj[i].id +
							"' style='background-color:" +
							replyObj[i].taustavari +
							"'" +
							aktiivinen +
							">" +
							replyObj[i].raporttinumero +
							" " +
							replyObj[i].lyhenne +
							"</option>";
					}
				}
			} else {
				alert("Tietokantavirhe");
			}

			valmis.resolve("Osastovalinnat");
		}
	);

	return valmis;
}

function vuoro_aseta_raporttiosasto(v_id) {
	let r_raportti_osasto_id = $(
		"#vuoro_raportti_osastoid_" + v_id + " option:selected"
	).val();
	let v_tyyppi = $("#vuoro_tyyppi_" + v_id).data("vuorotyyppi");
	let v_nakyma = "Vuoronäkymä";

	$.post(
		"php/aseta_raporttiosasto.php",
		{
			id: v_id,
			raportti_osasto_id: r_raportti_osasto_id,
			tyyppi: v_tyyppi,
			tunnus: kayttajatunnus,
			nakyma: v_nakyma,
		},
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				if (replyObj[0] > 0) {
					$("#vuoro_rivi_" + v_id).animate(
						{ backgroundColor: "#ffffff", color: "black" },
						500
					);

					if ($("#vuoro_rivi_" + v_id).hasClass("valittu_vuoro_rivi")) {
						$("#vuoro_rivi_" + v_id).animate(
							{ backgroundColor: "#91ed50", color: "black" },
							500
						);
					} else {
						if ($("#vuoro_rivi_" + v_id).index() % 2 != 0) {
							$("#vuoro_rivi_" + v_id).animate(
								{ backgroundColor: "#50AAF9", color: "white" },
								500
							);
						} else {
							$("#vuoro_rivi_" + v_id).animate(
								{ backgroundColor: "#86CFF9", color: "white" },
								500
							);
						}
					}
				} else {
					nayta_tilaviesti("Vuoro vanhentunut, haetaan vuorot");
					vuoro_hae_vuorot();
				}
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function vuoro_aseta_osasto(v_id) {
	let o_osasto_id = $("#vuoro_osastoid_" + v_id + " option:selected").val();
	let v_tyyppi = $("#vuoro_tyyppi_" + v_id).data("vuorotyyppi");
	let v_kommentti = $("#vuoro_taustakommentti_" + v_id).val();
	let v_nakyma = "Vuoronäkymä";

	$.post(
		"php/aseta_osasto.php",
		{
			id: v_id,
			osasto_id: o_osasto_id,
			tyyppi: v_tyyppi,
			kommentti: v_kommentti,
			tunnus: kayttajatunnus,
			nakyma: v_nakyma,
		},
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				if (replyObj[0] > 0) {
					$("#vuoro_rivi_" + v_id).animate(
						{ backgroundColor: "#ffffff", color: "black" },
						500
					);

					if ($("#vuoro_rivi_" + v_id).hasClass("valittu_vuoro_rivi")) {
						$("#vuoro_rivi_" + v_id).animate(
							{ backgroundColor: "#91ed50", color: "black" },
							500
						);
					} else {
						if ($("#vuoro_rivi_" + v_id).index() % 2 != 0) {
							$("#vuoro_rivi_" + v_id).animate(
								{ backgroundColor: "#50AAF9", color: "white" },
								500
							);
						} else {
							$("#vuoro_rivi_" + v_id).animate(
								{ backgroundColor: "#86CFF9", color: "white" },
								500
							);
						}
					}
				} else {
					nayta_tilaviesti("Vuoro vanhentunut, haetaan vuorot");
					vuoro_hae_vuorot();
				}
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function vuoro_hae_tausta_valinnat() {
	vuoro_tausta_valinnat = "";
	let valmis = $.Deferred();
	$.post("php/hae_sijaisuustausta_valinnat.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			vuoro_tausta_valinnat =
				"<option value='0' style='background-color:#ffffff'></option>";

			for (let i = 0; i < replyObj.length; i++) {
				let tausta_valittavissa = "";
				let tausta_taustavari = "#ffffff";
				if (replyObj[i].numero == 1) {
					kotiosasto_tausta_id = replyObj[i].id;
					tausta_taustavari = "#90ff7c";
				}
				if (kayttaja_sijaisuustausta_idt.indexOf(replyObj[i].id) == -1) {
					tausta_valittavissa = " disabled class='piilotettu'";
				}
				vuoro_tausta_valinnat +=
					"<option value='" +
					replyObj[i].id +
					"'" +
					tausta_valittavissa +
					" style='background-color:" +
					tausta_taustavari +
					"'>" +
					replyObj[i].numero +
					" = " +
					replyObj[i].selite +
					"</option>";
			}
		} else {
			alert("Tietokantavirhe");
		}
		valmis.resolve("Sijaisuustausta");
	});
	return valmis;
}

function vuoro_aseta_sijaisuustausta(v_id) {
	let t_tausta_id = $("#vuoro_taustaid_" + v_id + " option:selected").val();
	let v_tyyppi = $("#vuoro_tyyppi_" + v_id).data("vuorotyyppi");
	let v_nakyma = "Vuoronäkymä";

	$.post(
		"php/aseta_sijaisuustausta.php",
		{
			id: v_id,
			tausta_id: t_tausta_id,
			tyyppi: v_tyyppi,
			tunnus: kayttajatunnus,
			nakyma: v_nakyma,
		},
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				if (replyObj[0] > 0) {
					$("#vuoro_rivi_" + v_id).animate(
						{ backgroundColor: "#ffffff", color: "black" },
						500
					);

					if ($("#vuoro_rivi_" + v_id).hasClass("valittu_vuoro_rivi")) {
						$("#vuoro_rivi_" + v_id).animate(
							{ backgroundColor: "#91ed50", color: "black" },
							500
						);
					} else {
						if ($("#vuoro_rivi_" + v_id).index() % 2 != 0) {
							$("#vuoro_rivi_" + v_id).animate(
								{ backgroundColor: "#50AAF9", color: "white" },
								500
							);
						} else {
							$("#vuoro_rivi_" + v_id).animate(
								{ backgroundColor: "#86CFF9", color: "white" },
								500
							);
						}
					}
				} else {
					nayta_tilaviesti("Vuoro vanhentunut, haetaan vuorot");
					vuoro_hae_vuorot();
				}
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function vuoro_aseta_sijaisuustausta_kommentti(v_id) {
	let t_kommentti = $("#vuoro_taustakommentti_" + v_id).val();
	let v_tyyppi = $("#vuoro_tyyppi_" + v_id).data("vuorotyyppi");
	let t_kommentti_teksti = $("#vuoro_taustakommentti_teksti_" + v_id).html();
	let v_nakyma = "Vuoronäkymä";

	if (t_kommentti != t_kommentti_teksti) {
		$.post(
			"php/aseta_sijaisuustausta_kommentti.php",
			{
				id: v_id,
				tausta_kommentti: t_kommentti,
				tyyppi: v_tyyppi,
				tunnus: kayttajatunnus,
				nakyma: v_nakyma,
			},
			function (reply) {
				if (reply == "parametri") {
					alert("Parametrivirhe");
				} else if (reply.indexOf("Tietokantavirhe:") == -1) {
					let replyObj = JSON.parse(reply);
					if (replyObj[0] > 0) {
						$("#vuoro_taustakommentti_teksti_" + v_id).html(t_kommentti);
						$("#vuoro_rivi_" + v_id).animate(
							{ backgroundColor: "#ffffff", color: "black" },
							500
						);

						if ($("#vuoro_rivi_" + v_id).hasClass("valittu_vuoro_rivi")) {
							$("#vuoro_rivi_" + v_id).animate(
								{ backgroundColor: "#91ed50", color: "black" },
								500
							);
						} else {
							if ($("#vuoro_rivi_" + v_id).index() % 2 != 0) {
								$("#vuoro_rivi_" + v_id).animate(
									{ backgroundColor: "#50AAF9", color: "white" },
									500
								);
							} else {
								$("#vuoro_rivi_" + v_id).animate(
									{ backgroundColor: "#86CFF9", color: "white" },
									500
								);
							}
						}
					} else {
						nayta_tilaviesti("Vuoro vanhentunut, haetaan vuorot");
						vuoro_hae_vuorot();
					}
				} else {
					alert("Tietokantavirhe");
				}
			}
		);
	}
}

function vuoro_hae_paivan_viesti() {
	if (
		$.datepicker.formatDate("dd.mm.yy", $("#pvmHaku").datepicker("getDate")) !=
			"" &&
		$("#vuorotoimialuesuodatin").val().length == 1
	) {
		$("#vuoro_viestinakyma").show();
		let viestit_pvm = $.datepicker.formatDate(
			"dd.mm.yy",
			$("#pvmHaku").datepicker("getDate")
		);
		let t_id = $("#vuorotoimialuesuodatin").val();

		$.post(
			"php/hae_paivan_viesti.php",
			{ pvm: viestit_pvm, toimialue_id: t_id },
			function (reply) {
				if (reply == "parametri") {
					alert("Parametrivirhe");
				} else if (reply.indexOf("Tietokantavirhe:") == -1) {
					$("#viestiruutu").val(reply);
				} else {
					alert("Tietokantavirhe");
				}
			}
		);
	} else {
		$("#vuoro_viestinakyma").hide();
	}
}

function vuoro_nayta_paivan_viesti_ruutu() {
	$("#viestiruutu_iso").val($("#viestiruutu").val());
	$("#viestiruutu_iso").css("background-color", "#fff");
	$("#paivanviestiruutu").dialog("open");
}

function vuoro_aseta_paivan_viesti() {
	let valittu_paiva = $("#pvmHaku").datepicker("getDate");
	let paiva = valittu_paiva.getDate();
	let kuukausi = valittu_paiva.getMonth() + 1;
	if (paiva <= 9) {
		paiva = "0" + paiva;
	}
	if (kuukausi <= 9) {
		kuukausi = "0" + kuukausi;
	}

	let pvmTeksti = valittu_paiva.getFullYear() + "-" + kuukausi + "-" + paiva;
	let viestiTeksti = $("#viestiruutu_iso").val();
	let t_id = $("#vuorotoimialuesuodatin").val();

	if (t_id.length == 1) {
		$.post(
			"php/aseta_paivan_viesti.php",
			{ pvm: pvmTeksti, teksti: viestiTeksti, toimialue_id: t_id },
			function (reply) {
				if (reply == "parametri") {
					alert("Parametrivirhe");
				} else if (reply.indexOf("Tietokantavirhe:") == -1) {
					$("#paivanviestiruutu").dialog("close");
					$("#viestiruutu").animate({ backgroundColor: "#a9db6c" }, 2000);
					$("#viestiruutu").animate({ backgroundColor: "#fff" }, 1000);
					$("#viestiruutu").val($("#viestiruutu_iso").val());
				} else {
					alert("Tietokantavirhe");
				}
			}
		);
	} else {
		alert("Valitse yksi toimialue");
	}
}

/******************* VUOROSUUNNITTELU **********************************/
function alusta_vuorosuunnittelu() {
	if (!suunnittelu_alustettu) {
		//Vuorokalenterin asetukset ja luonti
		scheduler.config.xml_date = "%Y-%m-%d";
		scheduler.config.readonly = true;
		scheduler.config.dblclick_create = false;
		scheduler._tooltip = $(".dhx_year_tooltip")[0];

		scheduler.createTimelineView({
			name: "timeline",
			x_unit: "day",
			x_date: "%D %d",
			x_step: 1,
			x_start: 0,
			x_size: 21,
			y_property: "sijainen_id",
			render: "cell",
			section_autoheight: false,
			y_unit: scheduler.serverList("sijaiset", [{}]),
			second_scale: {
				x_unit: "week",
				x_date: "%W",
			},
		});

		//Vuorokalenteri y datan väri
		scheduler.templates.timeline_scaley_class = function (key, label, section) {
			if (section.key == valittu_sijainen_id) {
				return "suunnittelu_solu_tausta_valittu";
			} else {
				return "suunnittelu_solu_tausta";
			}
		};

		//Vuorokalenteri x datan väri
		scheduler.templates.timeline_scalex_class = function (date) {
			return "suunnittelu_solu_tausta";
		};

		//Vuorokalenteri solujen väri
		scheduler.templates.timeline_cell_class = function (evs, date, section) {
			if (sijaisten_idt == -1) {
				return "suunnittelu_tyhja_pvm";
			}

			let vuoronakyvyys = "";

			if (evs && evs[0].muokattu == false) {
				if (evs[0].nakyvyys == 1) {
					vuoronakyvyys = "suunnittelu_nakyvyys_mobiili ";
				} else if (evs && evs[0].nakyvyys == 0) {
					vuoronakyvyys = "suunnittelu_nakyvyys_kaikki ";
				}
			}

			if (
				section.key == valittu_sijainen_id &&
				date.getTime() == valittu_pvm.getTime()
			) {
				if (evs && evs[0].luku == 1) {
					return vuoronakyvyys + "suunnittelu_valittu_pvm_luku";
				} else {
					return vuoronakyvyys + "suunnittelu_valittu_pvm";
				}
			}

			if (evs && tyyppilista) {
				if (
					suunnittelu_vuoro_vaihto_tila &&
					evs[0].luku == 0 &&
					valittu_sijainen_id != -1
				) {
					let lahdeosastot = suunnittelu_vuoro_vaihto_tiedot["lahdeosastot"];
					let lahdekiinnitykset =
						suunnittelu_vuoro_vaihto_tiedot["lahdekiinnitykset"];

					let kohdeosastot = [];
					let kohdekiinnitykset = [];

					if (
						Object.keys(suunnittelu_sijaisten_osastot).indexOf(
							evs[0].sijainen_id
						) != -1
					) {
						kohdeosastot =
							suunnittelu_sijaisten_osastot[evs[0].sijainen_id].split(",");
					}

					if (evs[0].suunnitellut_kiinnitykset.length > 0) {
						kohdekiinnitykset = evs[0].suunnitellut_kiinnitykset;
					} else if (evs[0].vuoro_kiinnitykset.length > 0) {
						kohdekiinnitykset = evs[0].vuoro_kiinnitykset;
					}

					for (let i = 0; i < lahdekiinnitykset.length; i++) {
						if (
							kohdeosastot.indexOf(lahdekiinnitykset[i].osasto_id) == -1 &&
							suunnittelu_toimialueettomat_osastot.indexOf(
								lahdekiinnitykset[i].osasto_id
							) == -1
						) {
							return (
								vuoronakyvyys +
								"suunnittelu_vuoro_muokattava suunnittelu_vuoro_ei_vaihdettavissa"
							);
						}
					}

					for (let i = 0; i < kohdekiinnitykset.length; i++) {
						if (
							lahdeosastot.indexOf(kohdekiinnitykset[i].osasto_id) == -1 &&
							suunnittelu_toimialueettomat_osastot.indexOf(
								kohdekiinnitykset[i].osasto_id
							) == -1
						) {
							return (
								vuoronakyvyys +
								"suunnittelu_vuoro_muokattava suunnittelu_vuoro_ei_vaihdettavissa"
							);
						}
					}

					return (
						vuoronakyvyys +
						"suunnittelu_vuoro_muokattava suunnittelu_vuoro_vaihdettavissa"
					);
				} else {
					for (let i = 0; i < tyyppilista.length; i++) {
						if (evs[0].vuorotyyppi == tyyppilista[i].tyyppi) {
							let tila = "";
							let taustavari = "";

							if (evs[0].luku == 1) {
								tila = "suunnittelu_vuoro_luku";
							} else {
								tila = "suunnittelu_vuoro_muokattava";
							}

							if ($("#vuorotaustavari_valinta").prop("checked") == false) {
								if (evs[0].suunnitellut_kiinnitykset.length > 0) {
									taustavari = " suunnittelu_suunniteltu_kiinnitys";
								} else if (evs[0].vuoro_kiinnitykset.length > 0) {
									taustavari = " suunnittelu_vuoro_kiinnitys";
								} else {
									taustavari = " suunnittelu_vuoro_varattavissa";
								}
							} else {
								taustavari =
									" suunnittelu_vuoro_taustavari_" +
									tyyppilista[i].vari_hex.substring(1);
							}

							return vuoronakyvyys + tila + taustavari;
						}
					}
				}
			} else if (suunnittelu_vuoro_vaihto_tila && valittu_sijainen_id != -1) {
				return (
					vuoronakyvyys +
					"suunnittelu_vuoro_muokattava suunnittelu_vuoro_vaihdettavissa"
				);
			}

			if (
				valittu_sijainen_id == -1 ||
				valittu_pvm == "" ||
				!solu_valittu ||
				valittu_rivinumero == -1
			) {
				return "suunnittelu_tyhja_pvm";
			}

			return "suunnittelu_tyhja_pvm";
		};

		//Vuorokalenterin Y-akselin datan esitys
		scheduler.templates.timeline_scale_label = function (key, label, section) {
			return section.label;
		};

		//Vuorokalenterin vuorojen tooltip
		scheduler.templates.timeline_tooltip = function (
			aloitus,
			lopetus,
			tapahtuma
		) {
			if ($("#vuorokiinnitysteksti_valinta").prop("checked") == true) {
				if (tapahtuma.suunnitellut_kiinnitykset.length > 0) {
					let suunnitellut_kiinnitykset_teksti = "";
					for (let i = 0; i < tapahtuma.suunnitellut_kiinnitykset.length; i++) {
						const osasto =
							tapahtuma.suunnitellut_kiinnitykset[i].osasto == ""
								? "Ei osastoa"
								: tapahtuma.suunnitellut_kiinnitykset[i].osasto;
						const tausta =
							tapahtuma.suunnitellut_kiinnitykset[i].tausta == ""
								? "Ei taustaa"
								: tapahtuma.suunnitellut_kiinnitykset[i].tausta;
						suunnitellut_kiinnitykset_teksti +=
							"<div class='suunnittelu_vuorokiinnitys_teksti_rivi'><span class='suunnittelu_vuorokiinnitys_teksti_vuorotyyppi'>" +
							tapahtuma.suunnitellut_kiinnitykset[i].vuorotyyppi +
							"</span><span class='suunnittelu_vuorokiinnitys_teksti_osasto'>" +
							osasto +
							"</span><span class='suunnittelu_vuorokiinnitys_teksti_tausta'>" +
							tausta +
							"</span></div>";
					}

					if ($(".dhx_year_tooltip").hasClass("piilotettu")) {
						$(".dhx_year_tooltip").removeClass("piilotettu");
					}

					return suunnitellut_kiinnitykset_teksti;
				} else if (tapahtuma.vuoro_kiinnitykset.length > 0) {
					let vuoro_kiinnitykset_teksti = "";
					for (let i = 0; i < tapahtuma.vuoro_kiinnitykset.length; i++) {
						const osasto =
							tapahtuma.vuoro_kiinnitykset[i].osasto == ""
								? "Ei osastoa"
								: tapahtuma.vuoro_kiinnitykset[i].osasto;
						const tausta =
							tapahtuma.vuoro_kiinnitykset[i].tausta == ""
								? "Ei taustaa"
								: tapahtuma.vuoro_kiinnitykset[i].tausta;

						vuoro_kiinnitykset_teksti +=
							"<div class='suunnittelu_vuorokiinnitys_teksti_rivi'><span class='suunnittelu_vuorokiinnitys_teksti_vuorotyyppi'>" +
							tapahtuma.vuoro_kiinnitykset[i].vuorotyyppi +
							"</span><span class='suunnittelu_vuorokiinnitys_teksti_osasto'>" +
							osasto +
							"</span><span class='suunnittelu_vuorokiinnitys_teksti_tausta'>" +
							tausta +
							"</span></div>";
					}

					if ($(".dhx_year_tooltip").hasClass("piilotettu")) {
						$(".dhx_year_tooltip").removeClass("piilotettu");
					}

					return vuoro_kiinnitykset_teksti;
				} else {
					if (!$(".dhx_year_tooltip").hasClass("piilotettu")) {
						$(".dhx_year_tooltip").addClass("piilotettu");
					}

					return "";
				}
			}
		};

		//Vuorokalenteri tooltipin piilotus
		$(".dhx_year_tooltip").mouseover(function () {
			if (!$(".dhx_year_tooltip").hasClass("piilotettu")) {
				$(".dhx_year_tooltip").addClass("piilotettu");
			}
		});

		//Vuorokalenteri solun korostus
		scheduler.attachEvent("onMouseMove", function (tapahtuma_id, tapahtuma) {
			$(".suunnittelu_vuoro_korostus").removeClass(
				"suunnittelu_vuoro_korostus"
			);
			if (
				$(tapahtuma.target).hasClass("dhx_matrix_cell") ||
				$(tapahtuma.target).parent().hasClass("dhx_matrix_cell")
			) {
				if (
					!$($(tapahtuma.target).closest(".dhx_matrix_cell")[0]).hasClass(
						"suunnittelu_vuoro_korostus"
					)
				) {
					$($(tapahtuma.target).closest(".dhx_matrix_cell")[0]).addClass(
						"suunnittelu_vuoro_korostus"
					);
				}
			} else {
				if (!$(".dhx_year_tooltip").hasClass("piilotettu")) {
					$(".dhx_year_tooltip").addClass("piilotettu");
				}
			}
		});

		//Vuorokalenterin solujen sisällön näyttö, asettaa vuorotyyppin näkyviin jos pvm sisältää vuoron
		scheduler.templates["timeline_cell_value"] = function (vuorot) {
			if (vuorot) {
				let loytyi = false;
				let vuorotyyppi = "";
				for (let i = 0; i < tyyppilista.length; i++) {
					if (vuorot[0].vuorotyyppi == tyyppilista[i].tyyppi) {
						vuorotyyppi = tyyppilista[i].suunnittelu_tyyppi;
						loytyi = true;
						break;
					}
				}

				if (loytyi) {
					return vuorotyyppi;
				} else {
					return "????"; //Tuntematon vuorotyyppi
				}
			}

			return "";
		};

		scheduler.attachEvent("onViewChange", function () {
			suunnittelu_hae_suunnitellut_vuorot();
		});

		//Näyttää päivän vuoroyhteenvedon painettaessa päivämäärää vuorokalenterin ylä-osassa
		scheduler.attachEvent("onXScaleClick", function (index, value, e) {
			if (sijaisten_idt == -1) {
				return;
			}
			let alku = value;
			let loppu = scheduler.date.add(alku, 1, "day");
			let vuorot = scheduler.getEvents(alku, loppu);
			let yhteenvetolista = [];
			let yhteensa = 0;
			let vuorotyypit = [];

			for (let i = 0; i < vuorot.length; i++) {
				if (vuorot[i].start_date.getTime() == value.getTime()) {
					//Tarkisteaan että vuoro on oikealle päivämäärälle
					for (let j = 0; j < tyyppilista.length; j++) {
						if (vuorot[i].vuorotyyppi == tyyppilista[j].tyyppi) {
							//Tarkistetaan että vuorotyyppi löytyy listalta ja suoritetaan laskut
							let suunniteltu_tyyppi = tyyppilista[j].suunnittelu_tyyppi;
							for (let k = 0; k < suunniteltu_tyyppi.length; k++) {
								let vuorotyyppi = tyyppilista[j].suunnittelu_tyyppi[k];
								if (Object.keys(yhteenvetolista).indexOf(vuorotyyppi) == -1) {
									//Tarkistetaan löytyykö vuorotyypin tietoja, jos ei, luodaan uusi
									yhteenvetolista[vuorotyyppi] = {
										maara: 0,
										tyyppi: vuorotyyppi,
									};
									vuorotyypit.push(vuorotyyppi);
								}
								let lukumaara = yhteenvetolista[vuorotyyppi].maara;
								lukumaara++;
								yhteensa++;

								yhteenvetolista[vuorotyyppi].maara = lukumaara;
							}
							break;
						}
					}
				}
			}

			vuorotyypit.sort();

			$("#yhteenvetotiedot").html("");
			let yhteenvetotiedot = "";
			for (let i = 0; i < vuorotyypit.length; i++) {
				let tyyppi = yhteenvetolista[vuorotyypit[i]]["tyyppi"];
				let maara = yhteenvetolista[vuorotyypit[i]]["maara"];
				let taustavari = "#ffffff";
				if ($("#vuorotaustavari_valinta").prop("checked") == true) {
					for (let j = 0; j < tyyppilista.length; j++) {
						if (vuorotyypit[i] == tyyppilista[j].tyyppi) {
							taustavari = tyyppilista[j].vari_hex;
						}
					}
				}

				yhteenvetotiedot +=
					"<tr>" +
					"<td><span class='vuorotyyppi_kuvake' style='background-color:" +
					taustavari +
					"'>" +
					tyyppi +
					"</span></td>" +
					"<td>" +
					maara +
					"</td>" +
					"</tr>";
			}

			if (yhteenvetotiedot == "") {
				yhteenvetotiedot +=
					"<tr>" + "<td colspan='2'>Ei vuoroja</td>" + "</tr>";
			} else {
				yhteenvetotiedot +=
					"<tr>" +
					"<td>Yhteensä</td>" +
					"<td class='yhteenveto_yhteensa'>" +
					yhteensa +
					"</td>" +
					"</tr>";
			}

			$("#yhteenvetotiedot").append(yhteenvetotiedot);
			$("#yhteenvetoRuutu").dialog("open");
		});

		//Näyttää sijaisen vuoroyhteenvedon painettaessa sijaisen nimeä vuorokalenterissa
		scheduler.attachEvent("onYScaleClick", function (index, section, e) {
			if (sijaisten_idt == -1) {
				return;
			}
			let minimi_pvm = scheduler.getState().min_date;
			let maksimi_pvm = scheduler.getState().max_date;
			let vuorot = scheduler.getEvents(minimi_pvm, maksimi_pvm);
			let yhteenvetolista = [];
			let yhteensa = 0;
			let vuorotyypit = [];

			for (let i = 0; i < vuorot.length; i++) {
				if (vuorot[i].sijainen_id == section.key) {
					//Tarkisteaan että vuoro on oikealle sijaiselle
					for (let j = 0; j < tyyppilista.length; j++) {
						if (vuorot[i].vuorotyyppi == tyyppilista[j].tyyppi) {
							//Tarkistetaan että vuorotyyppi löytyy listalta ja suoritetaan laskut
							let suunniteltu_tyyppi = tyyppilista[j].suunnittelu_tyyppi;
							for (let k = 0; k < suunniteltu_tyyppi.length; k++) {
								let vuorotyyppi = tyyppilista[j].suunnittelu_tyyppi[k];
								if (Object.keys(yhteenvetolista).indexOf(vuorotyyppi) == -1) {
									//Tarkistetaan löytyykö vuorotyypin tietoja, jos ei, luodaan uusi
									yhteenvetolista[vuorotyyppi] = {
										maara: 0,
										tyyppi: vuorotyyppi,
									};
									vuorotyypit.push(vuorotyyppi);
								}
								let lukumaara = yhteenvetolista[vuorotyyppi].maara;
								lukumaara++;
								yhteensa++;

								yhteenvetolista[vuorotyyppi].maara = lukumaara;
							}
							break;
						}
					}
				}
			}

			vuorotyypit.sort();

			$("#yhteenvetotiedot").html("");
			let yhteenvetotiedot = "";
			for (let i = 0; i < vuorotyypit.length; i++) {
				let tyyppi = yhteenvetolista[vuorotyypit[i]]["tyyppi"];
				let maara = yhteenvetolista[vuorotyypit[i]]["maara"];
				let taustavari = "#ffffff";
				if ($("#vuorotaustavari_valinta").prop("checked") == true) {
					for (let j = 0; j < tyyppilista.length; j++) {
						if (vuorotyypit[i] == tyyppilista[j].tyyppi) {
							taustavari = tyyppilista[j].vari_hex;
						}
					}
				}

				yhteenvetotiedot +=
					"<tr>" +
					"<td><span class='vuorotyyppi_kuvake' style='background-color:" +
					taustavari +
					"'>" +
					tyyppi +
					"</span></td>" +
					"<td>" +
					maara +
					"</td>" +
					"</tr>";
			}

			if (yhteenvetotiedot == "") {
				yhteenvetotiedot +=
					"<tr>" + "<td colspan='2'>Ei vuoroja</td>" + "</tr>";
			} else {
				yhteenvetotiedot +=
					"<tr>" +
					"<td>Yhteensä</td>" +
					"<td class='yhteenveto_yhteensa'>" +
					yhteensa +
					"</td>" +
					"</tr>";
			}

			$("#yhteenvetotiedot").append(yhteenvetotiedot);
			$("#yhteenvetoRuutu").dialog("open");
		});

		//Asettaa valituksi sijainen_id, pvm:n ja vuoron valitun solun perusteella
		scheduler.attachEvent(
			"onCellClick",
			function (x_ind, y_ind, x_val, y_val, kalenteritapahtuma) {
				if (sijaisten_idt == -1) {
					return;
				}

				//Näytetään suunnitellun vuoron kiinnitykset jos kiinnitystietojen muokkaus on aktivoitu
				if (suunnittelu_kiinnitys_muokkaus_tila) {
					if (y_val.length > 0 && y_val[0].id != "") {
						$("#vuorokiinnitykset_suunniteltuvuoro_id").html(y_val[0].id);

						if (!$(".dhx_year_tooltip").hasClass("piilotettu")) {
							$(".dhx_year_tooltip").addClass("piilotettu");
						}

						const sijaisentiedot = sijainenlista[y_ind].label;
						suunnittelu_hae_kiinnitykset(sijaisentiedot);
						$("#vuorokiinnityksetRuutu").dialog("open");
					} else {
						$("#vuorokiinnitykset_suunniteltuvuoro_id").html("");
					}
				}

				if (suunnittelu_vuoro_muokkaus_tila) {
					$("#vuorokalenteri").focus();

					valittu_suunniteltuvuoro_id = "";
					solu_valittu = true;

					//Tarkistetaanko onko solussa vuoroja
					if (y_val.length > 0) {
						if (y_val[0].luku == 1) {
							//Tarkistetaan onko solu lukutilassa, jos on, solua ei valita
							solu_valittu = false;
						} else {
							valittu_suunniteltuvuoro_id = y_val[0].id;
						}
					}

					valittu_pvm = new Date(x_val);
					viimeisin_suunniteltuvuoro_pvm = valittu_pvm;
					valittu_rivinumero = y_ind;
					valittu_sijainen_id = sijainenlista[valittu_rivinumero].key;

					scheduler.updateView();
				} else if (suunnittelu_vuoro_vaihto_tila) {
					$("#vuorokalenteri").focus();

					let ed_valittu_suunniteltuvuoro_id = valittu_suunniteltuvuoro_id;
					let ed_valittu_sijainen_id = valittu_sijainen_id;
					let ed_valittu_pvm = valittu_pvm;
					let lahdevuoro_valittu = false;

					if (solu_valittu) {
						lahdevuoro_valittu = true;
					}

					valittu_suunniteltuvuoro_id = "";
					solu_valittu = true;

					//Tarkistetaanko onko solussa vuoroja
					if (y_val.length > 0) {
						if (y_val[0].luku == 1) {
							//Tarkistetaan onko solu lukutilassa, jos on, solua ei valita
							solu_valittu = false;
							return;
						} else {
							if (y_val[0].id == ed_valittu_suunniteltuvuoro_id) {
								return;
							}
							valittu_suunniteltuvuoro_id = y_val[0].id;
						}
					}

					valittu_pvm = new Date(x_val);
					viimeisin_suunniteltuvuoro_pvm = valittu_pvm;
					valittu_rivinumero = y_ind;
					valittu_sijainen_id = sijainenlista[valittu_rivinumero].key;

					let osasto_idt = [];
					if (
						Object.keys(suunnittelu_sijaisten_osastot).indexOf(
							valittu_sijainen_id
						) != -1
					) {
						osasto_idt =
							suunnittelu_sijaisten_osastot[valittu_sijainen_id].split(",");
					}

					suunnittelu_vuoro_vaihto_tiedot["lahdeosastot"] = osasto_idt;
					suunnittelu_vuoro_vaihto_tiedot["lahdekiinnitykset"] = [];

					if (valittu_suunniteltuvuoro_id) {
						if (
							scheduler.getEvent(valittu_suunniteltuvuoro_id)
								.suunnitellut_kiinnitykset.length > 0
						) {
							suunnittelu_vuoro_vaihto_tiedot["lahdekiinnitykset"] =
								scheduler.getEvent(
									valittu_suunniteltuvuoro_id
								).suunnitellut_kiinnitykset;
						} else if (
							scheduler.getEvent(valittu_suunniteltuvuoro_id).vuoro_kiinnitykset
								.length > 0
						) {
							suunnittelu_vuoro_vaihto_tiedot["lahdekiinnitykset"] =
								scheduler.getEvent(
									valittu_suunniteltuvuoro_id
								).vuoro_kiinnitykset;
						}
					} else {
						suunnittelu_vuoro_vaihto_tiedot["lahdekiinnitykset"] = [];
					}

					if (lahdevuoro_valittu) {
						let ed_osasto_idt = [];
						if (
							Object.keys(suunnittelu_sijaisten_osastot).indexOf(
								ed_valittu_sijainen_id
							) != -1
						) {
							ed_osasto_idt =
								suunnittelu_sijaisten_osastot[ed_valittu_sijainen_id].split(
									","
								);
						}

						let ed_suunnittelu_vuoro_vaihto_tiedot = [];
						ed_suunnittelu_vuoro_vaihto_tiedot["lahdeosastot"] = ed_osasto_idt;
						ed_suunnittelu_vuoro_vaihto_tiedot["lahdekiinnitykset"] = [];

						if (ed_valittu_suunniteltuvuoro_id) {
							if (
								scheduler.getEvent(ed_valittu_suunniteltuvuoro_id)
									.suunnitellut_kiinnitykset.length > 0
							) {
								suunnittelu_vuoro_vaihto_tiedot["lahdekiinnitykset"] =
									scheduler.getEvent(
										ed_valittu_suunniteltuvuoro_id
									).suunnitellut_kiinnitykset;
							} else if (
								scheduler.getEvent(ed_valittu_suunniteltuvuoro_id)
									.vuoro_kiinnitykset.length > 0
							) {
								suunnittelu_vuoro_vaihto_tiedot["lahdekiinnitykset"] =
									scheduler.getEvent(
										ed_valittu_suunniteltuvuoro_id
									).vuoro_kiinnitykset;
							}
						}

						//Tarkistetaan voiko vaihtoa tehdä
						let lahdeosastot =
							ed_suunnittelu_vuoro_vaihto_tiedot["lahdeosastot"];
						let lahdekiinnitykset =
							ed_suunnittelu_vuoro_vaihto_tiedot["lahdekiinnitykset"];
						let kohdeosastot = suunnittelu_vuoro_vaihto_tiedot["lahdeosastot"];
						let kohdekiinnitykset =
							suunnittelu_vuoro_vaihto_tiedot["lahdekiinnitykset"];

						if (lahdekiinnitykset.length > 0 || kohdekiinnitykset.length > 0) {
							for (let i = 0; i < lahdekiinnitykset.length; i++) {
								if (
									kohdeosastot.indexOf(lahdekiinnitykset[i].osasto_id) == -1 &&
									suunnittelu_toimialueettomat_osastot.indexOf(
										lahdekiinnitykset[i].osasto_id
									) == -1
								) {
									solu_valittu = false;
									valittu_pvm = "";
									valittu_suunniteltuvuoro_id = "";
									valittu_rivinumero = -1;
									valittu_sijainen_id = -1;
									scheduler.updateView();
									return;
								}
							}

							for (let i = 0; i < kohdekiinnitykset.length; i++) {
								if (
									lahdeosastot.indexOf(kohdekiinnitykset[i].osasto_id) == -1 &&
									suunnittelu_toimialueettomat_osastot.indexOf(
										kohdekiinnitykset[i].osasto_id
									) == -1
								) {
									solu_valittu = false;
									valittu_pvm = "";
									valittu_suunniteltuvuoro_id = "";
									valittu_rivinumero = -1;
									valittu_sijainen_id = -1;
									scheduler.updateView();
									return;
								}
							}

							suunnittelu_suorita_vuoro_vaihto(
								ed_valittu_suunniteltuvuoro_id,
								ed_valittu_sijainen_id,
								ed_valittu_pvm,
								valittu_suunniteltuvuoro_id,
								valittu_sijainen_id,
								valittu_pvm
							);
						} else {
							solu_valittu = false;
							valittu_pvm = "";
							valittu_suunniteltuvuoro_id = "";
							valittu_rivinumero = -1;
							valittu_sijainen_id = -1;
						}
					}

					scheduler.updateView();
				}
			}
		);

		//Vuorokalenterin solussa painettujen näppäinten tunnistus
		$("#vuorokalenteri").keydown(function (painiketapahtuma) {
			if (
				!suunnittelu_vuoro_muokkaus_tila ||
				!solu_valittu ||
				sijaisten_idt == -1
			) {
				return;
			}

			painiketapahtuma.preventDefault();
			painiketapahtuma.stopPropagation();

			let nappain = painiketapahtuma.which;
			let shift_painettu = painiketapahtuma.shiftKey;

			let ensimmainen_solu = scheduler.getState().min_date.getTime();
			let viimeinen_solu = scheduler.date.add(
				scheduler.getState().max_date,
				-1,
				"day"
			);
			let toiminta = false;

			switch (nappain) {
				case 8: //Backspace
				case 46: //Delete
					if (painiketapahtuma.preventDefault) {
						painiketapahtuma.preventDefault();
					} else {
						painiketapahtuma.returnValue = false;
					}
					if (valittu_suunniteltuvuoro_id != "") {
						suunnittelu_poista_suunniteltuvuoro(valittu_suunniteltuvuoro_id);
						valittu_suunniteltuvuoro_id = "";
						scheduler.updateView();
						return;
						//toiminta = true;
					}
					break;

				case 38: //Up arrow
					//Tarkistetaan onko edellistä sijaista
					if (valittu_rivinumero - 1 > -1) {
						valittu_rivinumero--;
					} else {
						valittu_rivinumero = sijainenlista.length - 1;
					}
					toiminta = true;
					break;

				case 40: //Down arrow
					//Tarkistetaan onko seuraavaa sijaista
					if (valittu_rivinumero + 1 < sijainenlista.length) {
						valittu_rivinumero++;
					} else {
						valittu_rivinumero = 0;
					}
					toiminta = true;
					break;

				case 37: //Left arrow
					let edellinen_solu = scheduler.date
						.add(valittu_pvm, -1, "day")
						.getTime();

					//Tarkistetaan onko edellistä solua
					if (edellinen_solu < ensimmainen_solu) {
						//Tarkistetaan onko edellistä sijaista
						if (valittu_rivinumero - 1 > -1) {
							valittu_rivinumero--;
						} else {
							valittu_rivinumero = sijainenlista.length - 1;
						}

						//Siirrytään viimeiseen soluun.
						valittu_pvm = scheduler.date.add(
							scheduler.getState().max_date,
							-1,
							"day"
						);
					} else {
						//Asetetaan valinta edelliseen soluun.
						valittu_pvm = scheduler.date.add(valittu_pvm, -1, "day");
					}
					toiminta = true;
					break;

				case 39: //Right arrow
					let seuraava_solu = scheduler.date
						.add(valittu_pvm, 1, "day")
						.getTime();

					//Tarkistetaan onko seuraavaa solua
					if (seuraava_solu > viimeinen_solu) {
						//Tarkistetaan onko seuraavaa sijaista
						if (valittu_rivinumero + 1 < sijainenlista.length) {
							valittu_rivinumero++;
						} else {
							valittu_rivinumero = 0;
						}

						//Siirrytään ensinmäiseen soluun.
						valittu_pvm = scheduler.getState().min_date;
					} else {
						//Asetetaan valinta seuraavaan soluun.
						valittu_pvm = scheduler.date.add(valittu_pvm, 1, "day");
					}
					toiminta = true;
					break;

				case 9: //Tab
					if (painiketapahtuma.preventDefault) {
						painiketapahtuma.preventDefault();
					} else {
						painiketapahtuma.returnValue = false;
					}

					if (shift_painettu) {
						//Shift + Tab
						let edellinen_solu = scheduler.date
							.add(valittu_pvm, -1, "day")
							.getTime();

						//Tarkistetaan onko edellistä solua
						if (edellinen_solu <= ensimmainen_solu) {
							//Tarkistetaan onko edellistä sijaista
							if (valittu_rivinumero - 1 > -1) {
								valittu_rivinumero--;
							} else {
								valittu_rivinumero = sijainenlista.length - 1;
							}

							//Siirrytään viimeiseen soluun.
							valittu_pvm = scheduler.getState().max_date;
						} else {
							//Asetetaan valinta edelliseen soluun.
							valittu_pvm = scheduler.date.add(valittu_pvm, -1, "day");
						}
					} else {
						let seuraava_solu = scheduler.date
							.add(valittu_pvm, 1, "day")
							.getTime();

						//Tarkistetaan onko seuraavaa solua
						if (seuraava_solu > viimeinen_solu) {
							//Tarkistetaan onko seuraavaa sijaista
							if (valittu_rivinumero + 1 < sijainenlista.length) {
								valittu_rivinumero++;
							} else {
								valittu_rivinumero = 0;
							}

							//Siirrytään ensinmäiseen soluun.
							valittu_pvm = scheduler.getState().min_date;
						} else {
							//Asetetaan valinta seuraavaan soluun.
							valittu_pvm = scheduler.date.add(valittu_pvm, 1, "day");
						}
					}
					toiminta = true;
					break;

				default:
					for (let i = 0; i < tyyppilista.length; i++) {
						if (
							painiketapahtuma.key.toUpperCase() ==
							tyyppilista[i].tyyppi.toUpperCase()
						) {
							let tyyppi = painiketapahtuma.key.toUpperCase();
							let loppu = scheduler.date.add(valittu_pvm, 1, "day");
							let dateTimeFormat = scheduler.date.date_to_str("%Y-%m-%d %H:%i");

							//Luodaan uusi suunniteltu vuoro jos valittu solu on tyhjä muussa tapauksessa tarkistetaan onko syötetty tyyppi sama kuin solussa oleva tyyppi ==> Päivitetään suunniteltu vuoro jos tyyppi eroaa
							if (
								valittu_suunniteltuvuoro_id == "" ||
								(valittu_suunniteltuvuoro_id != "" &&
									tyyppi !=
										scheduler.getEvent(valittu_suunniteltuvuoro_id).vuorotyyppi)
							) {
								suunnittelu_tallenna_suunniteltuvuoro(
									valittu_suunniteltuvuoro_id,
									dateTimeFormat(valittu_pvm),
									dateTimeFormat(loppu),
									tyyppi,
									valittu_sijainen_id
								);
							}

							if (suunnittelu_kiinnitys_muokkaus_tila == false) {
								//Tarkistetaan onko seuraavaa solua, jos ei, tarkistetaan onko seuraavaa sijaista, jos ei, siirrytään ensinmäiseen sijaiseen
								let seuraava_solu = scheduler.date
									.add(valittu_pvm, 1, "day")
									.getTime();

								//Valittu solu on sijaisen viimeinen
								if (seuraava_solu > viimeinen_solu) {
									if (valittu_rivinumero + 1 < sijainenlista.length) {
										//Valittu sijainen on viimeinen, siirrytään ensinmäiseen soluun.
										valittu_rivinumero++;
									} else {
										//Vaihdetaan seuraavaan sijaiseen
										valittu_rivinumero = 0;
									}

									//Siirrytään ensinmäiseen soluun.
									valittu_pvm = scheduler.getState().min_date;
								} else {
									//Asetetaan seuraava valinta seuraavaan soluun.
									valittu_pvm = scheduler.date.add(valittu_pvm, 1, "day");
								}
							}

							toiminta = true;
							break;
						}
					}
			}

			if (toiminta) {
				//Päivitetään valittu sijainen ja solu
				valittu_sijainen_id = sijainenlista[valittu_rivinumero].key;
				let loppu_pvm = scheduler.date.add(valittu_pvm, 1, "day");
				let evs = scheduler.getEvents(valittu_pvm, loppu_pvm);
				valittu_suunniteltuvuoro_id = "";
				solu_valittu = true;

				//Tarkistetaan kalenterista vuoro valitusta päivämäärästä seuraavaan päivämäärään
				if (evs.length > 0) {
					for (
						let j = 0;
						j < evs.length;
						j++ //Hakee kaikki solut valitulta ajanjaksolta, tarkistetaan valitun sijaisen id:llä oikea rivi.
					) {
						if (evs[j].sijainen_id == valittu_sijainen_id) {
							if (evs[j].luku == 1) {
								//Tarkistetaan onko solu lukutilassa
								solu_valittu = false;
							} else {
								valittu_suunniteltuvuoro_id = evs[j].id;
							}
						}
					}
				}

				scheduler.updateView();

				$(".dhx_cal_data").scrollTop(
					$(".suunnittelu_valittu_pvm").offset().top -
						$(".dhx_cal_data").offset().top +
						$(".dhx_cal_data").scrollTop()
				);
			}
		});

		//Vuorokalenterin näyttö
		scheduler.init(
			"vuorokalenteri",
			suunnittelu_aseta_kalenterin_pvm(),
			"timeline"
		);

		//Alustaa yhteenveto ruudun
		$("#yhteenvetoRuutu").dialog({
			autoOpen: false,
			title: "Yhteenveto",
			width: 250,
			height: 350,
			buttons: [
				{
					class: "oikeapainike",
					text: "Ok",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa yhteenvetotiedot
		$("#yhteenvetotiedot").html("");

		//Alustaa vuorotyyppi ruudun
		$("#vuorotyyppiRuutu").dialog({
			autoOpen: false,
			title: "Vuorotyypit",
			width: 550,
			height: 450,
			buttons: [
				{
					class: "keskipainike",
					text: "Ok",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa vuorovaraus ruudun
		$("#vuorovarausRuutu").dialog({
			autoOpen: false,
			title: "Vuorovaraukset",
			width: 450,
			height: 450,
			buttons: [
				{
					class: "oikeapainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Vuorovaraus poisto painike
		$("#vuorovaraus_poista_painike").button();

		//Vuorovaraus poisto ruutu
		$("#vuorovarauspoistoRuutu").dialog({
			autoOpen: false,
			modal: true,
			title: "Vuorovarausviestien poisto",
			width: 300,
			height: 200,
			buttons: [
				{
					class: "vasenpainike",
					text: "Ei",
					click: function () {
						$(this).dialog("close");
					},
				},
				{
					class: "oikeapainike",
					text: "Kyllä",
					click: function () {
						suunnittelu_poista_vuorovaraus_viestit();
					},
				},
			],
		});

		//Alustaa julkaisuruudun
		$("#julkaisuRuutu").dialog({
			autoOpen: false,
			width: 500,
			title: "Julkaise vuorot",
			buttons: [
				{
					class: "oikeapainike",
					disabled: false,
					text: "Julkaise",
					click: function () {
						suunnittelu_julkaise_vuorot();
					},
				},
				{
					class: "vasenpainike",
					disabled: false,
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa julkaisuyhteenvetoruudun
		$("#julkaisuYhteenvetoRuutu").dialog({
			autoOpen: false,
			title: "Muutokset vuoroihin",
			buttons: [
				{
					class: "oikeapainike",
					text: "Ok",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa vuorokiinnitysruudun
		$("#vuorokiinnityksetRuutu").dialog({
			autoOpen: false,
			title: "Vuorokiinnitykset",
			width: 1000,
			height: 450,
			buttons: [
				{
					id: "vuorokiinnitysruutu_sulje_painike",
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
				{
					id: "vuorokiinnitysruutu_tallenna_painike",
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						suunnittelu_tallenna_kiinnitykset();
					},
				},
			],
		});

		//Alustaa vuorolukituksetruudun
		$("#vuorolukituksetRuutu").dialog({
			autoOpen: false,
			title: "Vuorolukitukset",
			width: 800,
			height: 450,
			buttons: [
				{
					class: "keskipainike",
					disabled: false,
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa vuorolukituspoisto ruudun
		$("#vuorolukitusPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						suunnittelu_poista_vuorolukitus();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						suunnittelu_peruuta_vuorolukitus_poisto();
					},
				},
			],
		});

		//Alustaa vuoroyhdistelmätruudun
		$("#vuoroyhdistelmatRuutu").dialog({
			autoOpen: false,
			title: "Vuoroyhdistelmät",
			width: 750,
			height: 450,
			buttons: [
				{
					class: "keskipainike",
					disabled: false,
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa vuoroyhdistelmäpoisto ruudun
		$("#vuoroyhdistelmaPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						suunnittelu_poista_vuoroyhdistelma();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						suunnittelu_peruuta_vuoroyhdistelma_poisto();
					},
				},
			],
		});

		//Alustaa latausruudun
		$("#vuorosuunnittelulatausRuutu").dialog({
			autoOpen: false,
			title: "Haetaan suunniteltuja vuoroja...",
			width: 350,
			dialogClass: "ei_sulku_painiketta",
		});

		//Piilota julkaisuanimaatio
		$("#julkaisuLatausAnimaatio").hide();

		//Vuorokalenterin julkaisuasetukset painike
		$("#julkaisuasetuksetPainike").button("option", "icons", {
			primary: "ui-icon-julkaisuasetukset",
		});
		$("#julkaisuasetuksetPainike").button("option", "text", false);

		//Vuorokalenterin navigaatio painikkeet
		$("#suunnittelu_edellinen_jakso_painike").button("option", "icons", {
			primary: "ui-icon-edellinen",
		});
		$("#suunnittelu_edellinen_jakso_painike").button("option", "text", false);

		$("#suunnittelu_seuraava_jakso_painike").button("option", "icons", {
			primary: "ui-icon-seuraava",
		});
		$("#suunnittelu_seuraava_jakso_painike").button("option", "text", false);

		//Vuorotaustavärien asetus valinta
		$("#suunnittelu_vuorotausta_valinta_kehys").click(function () {
			if ($("#vuorotaustavari_valinta").prop("checked") == false) {
				$("#vuorotaustavari_valinta").prop("checked", true);
			} else {
				$("#vuorotaustavari_valinta").prop("checked", false);
			}
			suunnittelu_hae_vuorotyypit();
			suunnittelu_hae_suunnitellut_vuorot();
		});

		$("#vuorotaustavari_valinta").click(function (painiketapahtuma) {
			painiketapahtuma.stopPropagation();
			suunnittelu_hae_vuorotyypit();
			suunnittelu_hae_suunnitellut_vuorot();
		});

		//Vuorokiinnitys tekstien asetus valinta
		$("#suunnittelu_vuorokiinnitysteksti_valinta_kehys").click(function () {
			if ($("#vuorokiinnitysteksti_valinta").prop("checked") == false) {
				$("#vuorokiinnitysteksti_valinta").prop("checked", true);
			} else {
				$("#vuorokiinnitysteksti_valinta").prop("checked", false);
			}
			suunnittelu_hae_suunnitellut_vuorot();
		});

		$("#vuorokiinnitysteksti_valinta").click(function (painiketapahtuma) {
			painiketapahtuma.stopPropagation();
			suunnittelu_hae_suunnitellut_vuorot();
		});

		$("#vuoroyhdistelmat_tyyppi_tallennusrivi").keydown(function (
			painiketapahtuma
		) {
			let nappainkoodi = painiketapahtuma.which;
			let nappain = painiketapahtuma.key.toUpperCase();
			let ei_sallitut_nappaimet = $(this).data("nappaimet");
			if (
				ei_sallitut_nappaimet.indexOf(nappain) != -1 &&
				nappainkoodi != 8 &&
				nappainkoodi != 46 &&
				nappainkoodi != 37 &&
				nappainkoodi != 39 &&
				nappainkoodi != 9
			) {
				//Backspace, Delete, Vasen nuoli, Oikea nuoli, Tab
				painiketapahtuma.preventDefault();
			} else if (nappain.length == 1 && nappainkoodi != 32) {
				//Space
				$(this).val(nappain);
				$("#vuoroyhdistelmat_vuorotyypit_tallennusrivi").focus();
				painiketapahtuma.preventDefault();
			} else {
				painiketapahtuma.preventDefault();
			}
		});

		$("#vuoroyhdistelmat_tyyppi_tallennusrivi").change(function () {
			let ei_sallitut_nappaimet = $(this).data("nappaimet");
			if (ei_sallitut_nappaimet.indexOf($(this).val())) {
				$(this).val("");
			}
		});

		$("#vuoroyhdistelmat_vuorotyypit_tallennusrivi").keydown(function (
			painiketapahtuma
		) {
			let nappainkoodi = painiketapahtuma.which;
			let nappain = painiketapahtuma.key.toUpperCase();
			let sallitut_vuorotyypit = $(this).data("vuorotyypit");

			if (
				sallitut_vuorotyypit.indexOf(nappain) == -1 &&
				nappainkoodi != 8 &&
				nappainkoodi != 46 &&
				nappainkoodi != 37 &&
				nappainkoodi != 39 &&
				nappainkoodi != 9
			) {
				//Backspace, Delete, Vasen nuoli, Oikea nuoli, Tab
				painiketapahtuma.preventDefault();
			} else if ($(this).val().indexOf(nappain) != -1) {
				painiketapahtuma.preventDefault();
			}
		});

		$("#vuoroyhdistelmat_vuorotyypit_tallennusrivi").keyup(function (
			painiketapahtuma
		) {
			$(this).val($(this).val().toUpperCase());
		});

		$("#vuoroyhdistelmat_vuorotyypit_tallennusrivi").change(function () {
			let sallitut_vuorotyypit = $(this).data("vuorotyypit");
			let kenttaarvo = $(this).val();
			for (let i = 0; i < kenttaarvo.length; i++) {
				if (sallitut_vuorotyypit.indexOf(kenttaarvo[i]) == -1) {
					$(this).val("");
					break;
				}

				if ($(this).val().indexOf(kenttaarvo[i]) != i) {
					$(this).val("");
					break;
				}
			}
		});

		$("#vuoroyhdistelmat_vari_esikatselu_tallennusrivi").varivalinta();

		$("#suunnittelu_sijaisten_suodatin").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 13) {
				suunnittelu_hae_sijaiset();
			}
		});

		$("#julkaisu_alkupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
		});

		$("#julkaisu_loppupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
		});

		suunnittelu_alustettu = true;
	}

	$("#suunnittelu_toimialue_suodatin").html("");
	$("#suunnittelutoimialuepikavalinnat").html("");
	$("#suunnittelu_vuoro_painike").prop("disabled", false);
	$("#suunnittelu_kiinnitys_painike").prop("disabled", false);
	$("#suunnittelu_vaihto_painike").prop("disabled", false);
	$("#yhteenvetotiedot").html("");
	$("#suunnittelu_nakymavalinta").val(3);
	$("#vuorotaustavari_valinta").prop("checked", false);
	$("#vuorokiinnitysteksti_valinta").prop("checked", true);
	$("#vuorokiinnitykset_suunniteltuvuoro_id").html("");
	$("#suunnittelu_vuorovaraukset_painike").hide();
	$("#vuorolukitukset_data").html("");
	$("#vuorolukitukset_tallennusrivi").data("vuorolukitus_id", "");
	$("#vuorolukitukset_vuorotyyppi_tallennusrivi").html("");
	$("#vuorolukitukset_raportti_osasto_id_tallennusrivi").html("");
	$("#vuorolukitukset_osasto_id_tallennusrivi").html("");
	$("#vuoroyhdistelmat_data").html("");
	$("#vuoroyhdistelmat_tallennusrivi").data("vuoroyhdistelma_id", "");
	$("#vuoroyhdistelmat_tyyppi_tallennusrivi").val("");
	$("#vuoroyhdistelmat_tyyppi_tallennusrivi").data({ nappaimet: "" });
	$("#vuoroyhdistelmat_vuorotyypit_tallennusrivi").val("");
	$("#vuoroyhdistelmat_vuorotyypit_tallennusrivi").data("vuorotyypit", "");
	$("#vuoroyhdistelmat_kuvaus_tallennusrivi").val("");
	$("#vuoroyhdistelmat_vari_esikatselu_tallennusrivi").css(
		"background-color",
		"#ffffff"
	);
	$("#vuoroyhdistelmat_vari_esikatselu_tallennusrivi").data("vari", "#ffffff");
	$("#suunnittelu_vuoro_painike").css({
		color: "red",
		border: "1px solid red",
	});
	$("#suunnittelu_kiinnitys_painike").css({
		color: "red",
		border: "1px solid red",
	});
	$("#suunnittelu_vaihto_painike").css({
		color: "red",
		border: "1px solid red",
	});
	$("#julkaisuyhteenveto_poistetut").html("");
	$("#julkaisuyhteenveto_paivitetyt").html("");
	$("#julkaisuyhteenveto_luodut").html("");
	$("#julkaisuyhteenveto_yhteensa").html("");
	$("#julkaisuyhteenveto_kiinnitykset").html("");
	$("#suunnittelu_sijaisten_suodatin").val("");
	$("#suunnittelu_maaratiedot_vuorot").html("-");
	$("#suunnittelu_maaratiedot_sijaiset").html("-");
	$("#suunnittelunakymapikavalinnat .pikavalintapainikkeet").removeClass(
		"painike_valittu_tila"
	);
	$("#vuorokiinnitykset_suunniteltuvuoro_id").html("");
	$("#vuorokiinnitykset_vuorotiedot").html("");

	solu_valittu = false;
	valittu_pvm = "";
	valittu_suunniteltuvuoro_id = "";
	valittu_rivinumero = -1;
	valittu_sijainen_id = -1;
	suunnittelu_vuoro_vaihto_tiedot = [];
	suunnittelu_vuoro_vaihto_tila = false;
	suunnittelu_kiinnitys_muokkaus_tila = false;
	suunnittelu_vuoro_muokkaus_tila = false;
	suunnittelu_toimialueettomat_osastot = [];

	$.when(
		suunnittelu_hae_suunnittelu_vuorotyyppit(),
		suunnittelu_hae_toimialue_valinnat(),
		suunnittelu_hae_vuorotyypit(),
		suunnittelu_hae_osasto_valinnat(),
		suunnittelu_hae_tausta_valinnat()
	).then(function () {
		if (vuoro_alustettu) {
			$("#suunnittelu_nakyma_suodatin").val($("#vuoronakymavalinta").val());
			$("#suunnittelunakymapikavalinnat button").removeClass(
				"painike_valittu_tila"
			);
			if ($("#vuoronakymavalinta").val() == 1) {
				$("#suunnittelunakymapikavalinta_hoitaja").addClass(
					"painike_valittu_tila"
				);
			} else {
				$("#suunnittelunakymapikavalinta_sihteeri").addClass(
					"painike_valittu_tila"
				);
			}
		} else {
			//Näytä hoitajat
			$("#suunnittelu_nakyma_suodatin").val(1);
			$("#suunnittelunakymapikavalinta_hoitaja").addClass(
				"painike_valittu_tila"
			);
		}

		suunnittelu_hae_sijaiset();
		$("#vuorolukitukset_vuorotyyppi_tallennusrivi").html(vuorotyyppi_valinnat);
		$("#vuorolukitukset_raportti_osasto_id_tallennusrivi").html(
			suunnittelu_raporttiosasto_valinnat
		);
		$("#vuorolukitukset_osasto_id_tallennusrivi").html(
			suunnittelu_osasto_valinnat
		);
		$("#vuoroyhdistelmat_tyyppi_tallennusrivi").data(
			"nappaimet",
			suunnittelu_vuorotyypit
		);
		$("#vuoroyhdistelmat_vuorotyypit_tallennusrivi").data(
			"vuorotyypit",
			suunnittelu_vuorotyypit
		);
	});
}

function suunnittelu_edellinen_ajanjakso() {
	$(".dhx_cal_prev_button").click();
}

function suunnittelu_seuraava_ajanjakso() {
	$(".dhx_cal_next_button").click();
}

function suunnittelu_aseta_kalenterin_pvm() {
	let tanaan = new Date();
	let tanaan_viikko = $.datepicker.iso8601Week(tanaan);
	let viikkovali = tanaan_viikko % 3;
	const vuosi_alku_viikko = $.datepicker.iso8601Week(
		new Date(tanaan.getFullYear(), 0, 1)
	);

	if (vuosi_alku_viikko == 1) {
		//Vuosi alkaa viikosta 1
		if (viikkovali == 1) {
			viikkovahennys = 0;
		} else if (viikkovali == 2) {
			viikkovahennys = -1;
		} else if (viikkovali == 0) {
			viikkovahennys = -2;
		}
	} else if (vuosi_alku_viikko == 52) {
		if (tanaan_viikko <= 3 || tanaan_viikko == 52) {
			if (viikkovali == 1) {
				if (tanaan_viikko == 52) {
					viikkovahennys = 0;
				} else {
					viikkovahennys = -1;
				}
			} else if (viikkovali == 2) {
				viikkovahennys = -2;
			} else if (viikkovali == 0) {
				viikkovahennys = 0;
			}
		} else {
			if (viikkovali == 1) {
				viikkovahennys = -1;
			} else if (viikkovali == 2) {
				viikkovahennys = -2;
			} else if (viikkovali == 0) {
				viikkovahennys = 0;
			}
		}
	} else if (vuosi_alku_viikko == 53) {
		//Vuosi alkaa viikosta 53
		if (tanaan_viikko <= 3 || tanaan_viikko == 53) {
			if (viikkovali == 1) {
				viikkovahennys = 0;
			} else if (viikkovali == 2) {
				if (tanaan_viikko == 53) {
					viikkovahennys = -2;
				} else {
					viikkovahennys = -1;
				}
			} else if (viikkovali == 0) {
				viikkovahennys = -2;
			}
		} else {
			if (viikkovali == 1) {
				viikkovahennys = 0;
			} else if (viikkovali == 2) {
				viikkovahennys = -1;
			} else if (viikkovali == 0) {
				viikkovahennys = -2;
			}
		}
	}

	return scheduler.date.week_start(
		scheduler.date.add(tanaan, viikkovahennys, "week")
	);
}

function suunnittelu_hae_sijaiset() {
	let suunnittelu_toimialue_idt = $("#suunnittelu_toimialue_suodatin").val();
	let suunnittelu_sihteeritila = 0;
	if ($("#suunnittelu_nakyma_suodatin").val() == 0) {
		suunnittelu_sihteeritila = 1;
	}

	sijainenlista = [];
	sijaisten_idt = [];
	suunnittelu_sijaisten_osastot = [];

	let suodatin_hakusana = $("#suunnittelu_sijaisten_suodatin").val();

	$.post(
		"php/hae_suunnittelu_sijaiset.php",
		{
			toimialue_idt: suunnittelu_toimialue_idt,
			sihteeritila: suunnittelu_sihteeritila,
			hakusana: suodatin_hakusana,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);

						if (replyObj.length > 1) {
							for (let i = 1; i < replyObj.length; i++) {
								sijaisten_idt.push(replyObj[i].id);

								sijainenlista.push({
									key: replyObj[i].id,
									label: replyObj[i].nimi + " (" + replyObj[i].nimike + ")",
								});

								suunnittelu_sijaisten_osastot[replyObj[i].id] =
									replyObj[i].osasto_idt;
							}

							scheduler.updateCollection("sijaiset", sijainenlista);

							let sijainenmaara_teksti = "";
							let sijaiset_yht = 0;
							let sijaisten_maara = 0;

							if (replyObj[0].maara == 1) {
								sijaiset_yht = replyObj[0].maara + " sissi";
							} else {
								sijaiset_yht = replyObj[0].maara + " sissiä";
							}

							sijainenmaara_teksti = sijaiset_yht;

							if (suodatin_hakusana != "") {
								if (sijaisten_idt.length == 1) {
									sijaisten_maara = sijaisten_idt.length + " sissi";
								} else {
									sijaisten_maara = sijaisten_idt.length + " sissiä";
								}

								sijainenmaara_teksti =
									sijaisten_maara + " / yht. " + sijaiset_yht;
							}

							$("#suunnittelu_maaratiedot_vuorot").html("-");
							$("#suunnittelu_maaratiedot_sijaiset").html(sijainenmaara_teksti);
						} else {
							let tyhja = [{ key: "-1", label: "Ei sissejä" }];
							sijaisten_idt = "-1";
							sijainenlista = [];
							$("#suunnittelu_maaratiedot_vuorot").html("Ei vuoroja");

							let sijainenmaara_teksti = "";
							let sijaiset_yht = 0;
							let sijaisten_maara = 0;

							if (replyObj[0].maara == 0) {
								sijainenmaara_teksti = "Ei sissejä";
							} else {
								if (replyObj[0].maara == 1) {
									sijaiset_yht = replyObj[0].maara + " sissi";
								} else {
									sijaiset_yht = replyObj[0].maara + " sissiä";
								}

								sijainenmaara_teksti = "0 sijaista / yht. " + sijaiset_yht;
							}

							$("#suunnittelu_maaratiedot_sijaiset").html(sijainenmaara_teksti);

							suunnittelu_aseta_vuoro_muokkaus_tila(false);
							suunnittelu_aseta_kiinnitys_muokkaus_tila(false);
							suunnittelu_aseta_vuoro_vaihto_tila(false);

							scheduler.updateCollection("sijaiset", tyhja);
						}
				}
			}
		}
	);
}

function suunnittelu_hae_suunnittelu_vuorotyyppit() {
	let valmis = $.Deferred();
	tyyppilista = [];

	$.post("php/hae_suunnittelu_vuorotyypit.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			tyyppilista = replyObj;

			let taustavarit = [];
			$("style").html("");

			for (let i = 0; i < replyObj.length; i++) {
				let taustavari = replyObj[i].vari_hex;
				if (taustavarit.indexOf(taustavari) == -1) {
					taustavarit.push(taustavari);
					let taustavariteksti = taustavari.substring(1);
					$("style").append(
						".suunnittelu_vuoro_taustavari_" +
							taustavariteksti +
							" { background-color: " +
							taustavari +
							"}"
					);
				}
			}
			scheduler.updateView();
		} else {
			alert("Tietokantavirhe");
		}

		valmis.resolve();
	});
}

function suunnittelu_nayta_vuorotyypit() {
	$("#vuorotyyppiRuutu").dialog("open");
}

function suunnittelu_hae_vuorotyypit() {
	let valmis = $.Deferred();
	vuorotyyppi_valinnat = "<option value=''>Valitse</option>";
	suunnittelu_vuorotyypit = [];

	$.post("php/hae_vuorotyyppi_tiedot.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			$("#vuorotyyppitiedot").html("");

			for (let i = 0; i < replyObj.length; i++) {
				let id = replyObj[i].id;
				let vuorotyyppi = replyObj[i].vuorotyyppi;
				let taustavari = replyObj[i].taustavari;
				let kuvaus = replyObj[i].kuvaus;

				suunnittelu_vuorotyypit.push(vuorotyyppi);
				vuorotyyppi_valinnat +=
					"<option value='" +
					vuorotyyppi +
					"'>" +
					vuorotyyppi +
					" - " +
					kuvaus +
					"</option>";

				$("#vuorotyyppitiedot").append(
					"<tr>" +
						"<td><span id='vuorotyyppi_nappain_" +
						id +
						"'>" +
						vuorotyyppi +
						"</span></td>" +
						"<td><span id='vuorotyyppi_tyyppi_" +
						id +
						"' class='vuorotyyppi_kuvake'>" +
						vuorotyyppi +
						"</span></td>" +
						"<td><span id='vuorotyyppi_kuvaus_" +
						id +
						"'>" +
						kuvaus +
						"</span></td>" +
						"</tr>"
				);

				if ($("#vuorotaustavari_valinta").prop("checked") == true) {
					$("#vuorotyyppi_tyyppi_" + id).css({
						backgroundColor: replyObj[i].taustavari,
					});
				}
			}
		} else {
			alert("Tietokantavirhe");
		}

		valmis.resolve();
	});

	return valmis;
}

function suunnittelu_hae_osasto_valinnat() {
	suunnittelu_raporttiosasto_valinnat =
		"<option value=''>Valitse</option><option value='0'></option><option value='-1'>Sissin Kotiosasto</option>";
	suunnittelu_osasto_valinnat =
		"<option value=''>Valitse</option><option value='0'></option>";
	suunnittelu_osasto_varit = [];
	suunnittelu_osasto_tiedot = [];
	suunnittelu_osasto_valinta_tiedot = [];
	suunnittelu_toimialueettomat_osastot = [];
	let valmis = $.Deferred();

	$.post(
		"php/hae_osasto_valinnat.php",
		{ jarjestys: "lyhenne" },
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				if (replyObj.length > 0) {
					for (let i = 0; i < replyObj.length; i++) {
						if (replyObj[i].toimialue_id == 0) {
							suunnittelu_raporttiosasto_valinnat +=
								"<option value='" +
								replyObj[i].id +
								"'>" +
								replyObj[i].raporttinumero +
								" " +
								replyObj[i].lyhenne +
								"</option>";
							suunnittelu_osasto_valinnat +=
								"<option value='" +
								replyObj[i].id +
								"'>" +
								replyObj[i].raporttinumero +
								" " +
								replyObj[i].lyhenne +
								"</option>";
							suunnittelu_toimialueettomat_osastot.push(replyObj[i].id);
						}

						suunnittelu_osasto_varit[replyObj[i].id] = replyObj[i].taustavari;
						suunnittelu_osasto_tiedot[replyObj[i].id] = replyObj[i];

						let aktiivinen = "";
						if (replyObj[i].aktiivinen == 0) {
							aktiivinen = " disabled";
						}

						if (
							Object.keys(suunnittelu_osasto_valinta_tiedot).indexOf(
								replyObj[i].toimialue_id
							) != -1
						) {
							suunnittelu_osasto_valinta_tiedot[replyObj[i].toimialue_id] +=
								"<option value='" +
								replyObj[i].id +
								"' style='background-color:" +
								replyObj[i].taustavari +
								"'" +
								aktiivinen +
								">" +
								replyObj[i].raporttinumero +
								" " +
								replyObj[i].lyhenne +
								"</option>";
						} else {
							suunnittelu_osasto_valinta_tiedot[replyObj[i].toimialue_id] =
								"<option value='" +
								replyObj[i].id +
								"' style='background-color:" +
								replyObj[i].taustavari +
								"'" +
								aktiivinen +
								">" +
								replyObj[i].raporttinumero +
								" " +
								replyObj[i].lyhenne +
								"</option>";
						}
					}
				}
			} else {
				alert("Tietokantavirhe");
			}

			valmis.resolve();
		}
	);

	return valmis;
}

function suunnittelu_hae_tausta_valinnat() {
	suunnittelu_tausta_valinnat = "";
	let valmis = $.Deferred();
	$.post("php/hae_sijaisuustausta_valinnat.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			suunnittelu_tausta_valinnat =
				"<option value='0' style='background-color:#ffffff'></option>";

			for (let i = 0; i < replyObj.length; i++) {
				let tausta_valittavissa = "";
				let tausta_taustavari = "#ffffff";
				if (replyObj[i].numero == 1) {
					kotiosasto_tausta_id = replyObj[i].id;
					tausta_taustavari = "#90ff7c";
				}
				if (kayttaja_sijaisuustausta_idt.indexOf(replyObj[i].id) == -1) {
					tausta_valittavissa = " disabled class='piilotettu'";
				}
				suunnittelu_tausta_valinnat +=
					"<option value='" +
					replyObj[i].id +
					"'" +
					tausta_valittavissa +
					" style='background-color:" +
					tausta_taustavari +
					"'>" +
					replyObj[i].numero +
					" = " +
					replyObj[i].selite +
					"</option>";
			}
		} else {
			alert("Tietokantavirhe");
		}
		valmis.resolve("Sijaisuustausta");
	});
	return valmis;
}

function suunnittelu_hae_toimialue_valinnat() {
	$("#suunnittelu_toimialue_suodatin").html("");
	$("#suunnittelutoimialuepikavalinnat").html(
		"<button id='suunnittelutoimialuevalinta_0' class='toimialuepainike vuorokalenteri_paallys'>Kaikki</button>"
	);

	$("#suunnittelutoimialuevalinta_0").click(function () {
		$("#suunnittelutoimialuepikavalinnat button").removeClass(
			"painike_valittu_tila"
		);
		$(this).addClass("painike_valittu_tila");
		$("#suunnittelu_toimialue_suodatin option").prop("selected", "selected");
		suunnittelu_hae_sijaiset();
	});

	let valmis = $.Deferred();

	$.post(
		"php/hae_toimialue_valinnat.php",
		{ toimialue_idt: kayttaja_toimialue_idt },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);

				for (let i = 0; i < replyObj.length; i++) {
					$("#suunnittelutoimialuepikavalinnat").append(
						"<button id='suunnittelutoimialuevalinta_" +
							replyObj[i].id +
							"' class='toimialuepainike vuorokalenteri_paallys'>" +
							replyObj[i].lyhenne +
							"</button>"
					);
					$("#suunnittelu_toimialue_suodatin").append(
						"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].nimi +
							"</option>"
					);

					$("#suunnittelutoimialuevalinta_" + replyObj[i].id).click(function (
						painiketapahtuma
					) {
						let toimialue_id = $(this)
							.prop("id")
							.replace("suunnittelutoimialuevalinta_", "");
						let valitut_toimialue_idt = $(
							"#suunnittelu_toimialue_suodatin"
						).val();

						if (
							$("#suunnittelutoimialuevalinta_0").hasClass(
								"painike_valittu_tila"
							) &&
							$("#suunnittelu_toimialue_suodatin option").length ==
								valitut_toimialue_idt.length
						) {
							$("#suunnittelutoimialuepikavalinnat button").removeClass(
								"painike_valittu_tila"
							);
							$("#suunnittelu_toimialue_suodatin").val(toimialue_id).change();
							$(this).addClass("painike_valittu_tila");
						} else {
							if (painiketapahtuma.ctrlKey == true) {
								if ($(this).hasClass("painike_valittu_tila")) {
									if (
										$("#suunnittelutoimialuepikavalinnat .painike_valittu_tila")
											.length > 1
									) {
										$(this).removeClass("painike_valittu_tila");
										if (valitut_toimialue_idt.indexOf(toimialue_id) >= 0) {
											valitut_toimialue_idt.splice(
												valitut_toimialue_idt.indexOf(toimialue_id),
												1
											);
										}
										$("#suunnittelu_toimialue_suodatin")
											.val(valitut_toimialue_idt)
											.change();
									}
								} else {
									valitut_toimialue_idt.push(toimialue_id);
									$("#suunnittelu_toimialue_suodatin")
										.val(valitut_toimialue_idt)
										.change();
									if (
										$("#suunnittelu_toimialue_suodatin option").length ==
										valitut_toimialue_idt.length
									) {
										$("#suunnittelutoimialuepikavalinnat button").removeClass(
											"painike_valittu_tila"
										);
										$("#suunnittelutoimialuevalinta_0").addClass(
											"painike_valittu_tila"
										);
									} else {
										$(this).addClass("painike_valittu_tila");
									}
								}
							} else {
								$("#suunnittelutoimialuepikavalinnat button").removeClass(
									"painike_valittu_tila"
								);
								$("#suunnittelu_toimialue_suodatin").val(toimialue_id).change();
								$(this).addClass("painike_valittu_tila");
							}
						}
					});
				}

				$("#suunnittelutoimialuepikavalinnat button").button();

				if (vuoro_alustettu) {
					$("#suunnittelu_toimialue_suodatin").val(
						$("#vuorotoimialuesuodatin").val()
					);
					let valitut_toimialueet = $("#vuorotoimialuesuodatin").val();

					if (
						valitut_toimialueet.length ==
						$("#suunnittelu_toimialue_suodatin option").length
					) {
						$("#suunnittelutoimialuepikavalinnat button").removeClass(
							"painike_valittu_tila"
						);
						$("#suunnittelutoimialuevalinta_0").addClass(
							"painike_valittu_tila"
						);
					} else {
						for (let i = 0; i < valitut_toimialueet.length; i++) {
							$(
								"#suunnittelutoimialuevalinta_" + valitut_toimialueet[i]
							).addClass("painike_valittu_tila");
						}
					}
				} else {
					$("#suunnittelutoimialuevalinta_0").addClass("painike_valittu_tila");
					$("#suunnittelu_toimialue_suodatin option").prop(
						"selected",
						"selected"
					);
				}
			} else {
				alert("Tietokantavirhe");
			}

			valmis.resolve();
		}
	);

	return valmis;
}

function suunnittelu_hae_suunnitellut_vuorot() {
	if (sijaisten_idt == "-1") {
		return;
	}
	if ($("#latausnakyma").css("display") == "none") {
		$("#vuorosuunnittelulatausRuutu").dialog("open");
	}
	let formatAlkuLoppu = scheduler.date.date_to_str("%Y-%m-%d");
	let alku_pvm = formatAlkuLoppu(scheduler.getState().min_date);
	let loppu_pvm = formatAlkuLoppu(scheduler.getState().max_date);

	$.post(
		"php/hae_suunnitellut_vuorot.php",
		{ alkupvm: alku_pvm, loppupvm: loppu_pvm, sijainen_idt: sijaisten_idt },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				let vuoromaara = replyObj.shift();
				let vuoroteksti = "";
				if (vuoromaara > 0) {
					if (vuoromaara == 1) {
						vuoroteksti = vuoromaara + " vuoro";
					} else {
						vuoroteksti = vuoromaara + " vuoroa";
					}
				} else {
					vuoroteksti = "Ei vuoroja";
				}

				$("#suunnittelu_maaratiedot_vuorot").html(vuoroteksti);
				scheduler.clearAll();
				scheduler.parse(replyObj, "json");
				scheduler.updateView();
				$("#vuorosuunnittelulatausRuutu").dialog("close");
			} else {
				$("#vuorosuunnittelulatausRuutu").dialog("close");
				alert("Tietokantavirhe");
			}
		}
	);
}

function suunnittelu_hae_suunniteltu_vuoro(suunniteltuvuoro_id) {
	if ($("#latausnakyma").css("display") == "none") {
		$("#vuorosuunnittelulatausRuutu").dialog("open");
	}

	$.post(
		"php/hae_suunniteltu_vuoro.php",
		{ suunniteltuvuoro_id },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let paivitetty_vuoro = JSON.parse(reply);
				const paivitetyt_vuorot = scheduler
					.getEvents()
					.map(function (suunniteltu_vuoro) {
						return paivitetty_vuoro["id"] == suunniteltu_vuoro["id"]
							? paivitetty_vuoro
							: suunniteltu_vuoro;
					});
				scheduler.clearAll();
				scheduler.parse(paivitetyt_vuorot, "json");
				scheduler.updateView();
				$("#vuorosuunnittelulatausRuutu").dialog("close");
			} else {
				$("#vuorosuunnittelulatausRuutu").dialog("close");
				alert("Tietokantavirhe");
			}
		}
	);
}

function suunnittelu_tallenna_suunniteltuvuoro(
	suunniteltuvuoro_id,
	aloitus_pvm,
	lopetus_pvm,
	suunniteltuvuoro_tyyppi,
	sijaisen_id
) {
	if (suunniteltuvuoro_id != "") {
		$.post(
			"php/hae_suunnitellut_kiinnitykset.php",
			{ id: suunniteltuvuoro_id, tyyppi: suunniteltuvuoro_tyyppi },
			function (reply) {
				if (reply == "parametri") {
					alert("Parametrivirhe");
				} else if (reply.indexOf("Tietokantavirhe:") == -1) {
					let replyObj = JSON.parse(reply);
					let suunnitellut_kiinnitykset =
						replyObj[0]["suunnitellut_kiinnitykset"];

					$.post(
						"php/tallenna_suunniteltuvuoro.php",
						{
							id: suunniteltuvuoro_id,
							alkupvm: aloitus_pvm,
							loppupvm: lopetus_pvm,
							vuorotyyppi: suunniteltuvuoro_tyyppi,
							sijainen_id: sijaisen_id,
							kiinnitykset: suunnitellut_kiinnitykset,
						},
						function (reply) {
							if (reply == "parametri") {
								alert("Parametrivirhe");
							} else if (reply.indexOf("Tietokantavirhe:") == -1) {
								$("#vuorokiinnityksetRuutu").dialog("close");
								suunnittelu_hae_suunnitellut_vuorot();
							} else {
								alert("Tietokantavirhe");
							}
						}
					);
				} else {
					alert("Tietokantavirhe");
				}
			}
		);
	} else {
		let suunnitellut_kiinnitykset = "";
		$.post(
			"php/tallenna_suunniteltuvuoro.php",
			{
				id: suunniteltuvuoro_id,
				alkupvm: aloitus_pvm,
				loppupvm: lopetus_pvm,
				vuorotyyppi: suunniteltuvuoro_tyyppi,
				sijainen_id: sijaisen_id,
				kiinnitykset: suunnitellut_kiinnitykset,
			},
			function (reply) {
				if (reply == "parametri") {
					alert("Parametrivirhe");
				} else if (reply.indexOf("Tietokantavirhe:") == -1) {
					$("#vuorokiinnityksetRuutu").dialog("close");
					suunnittelu_hae_suunnitellut_vuorot();
				} else {
					alert("Tietokantavirhe");
				}
			}
		);
	}
}

function suunnittelu_poista_suunniteltuvuoro(suunniteltuvuoro_id) {
	$.post(
		"php/poista_suunniteltuvuoro.php",
		{ id: suunniteltuvuoro_id },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				$("#vuorokiinnityksetRuutu").dialog("close");
				suunnittelu_hae_suunnitellut_vuorot();
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function suunnittelu_hae_kiinnitykset(sijaisentiedot) {
	let suunniteltuvuoro_id = $("#vuorokiinnitykset_suunniteltuvuoro_id").html();
	let v_sijainen_id = scheduler.getEvent(suunniteltuvuoro_id).sijainen_id;
	const vuorotiedot =
		sijaisentiedot +
		" " +
		scheduler.getEvent(suunniteltuvuoro_id).start_date.toLocaleDateString();

	$("#vuorokiinnitykset_vuorotiedot").html(vuorotiedot);
	$("#vuorokiinnitykset").html("");

	let osasto_valinnat =
		"<option value='0' style='background-color:#ffffff'></option>";
	$.each(suunnittelu_osasto_valinta_tiedot, function (avain, arvo) {
		osasto_valinnat += suunnittelu_osasto_valinta_tiedot[avain];
	});

	let osasto_idt = [];
	if (Object.keys(suunnittelu_sijaisten_osastot).indexOf(v_sijainen_id) != -1) {
		osasto_idt = suunnittelu_sijaisten_osastot[v_sijainen_id].split(",");
	}

	let sijaisen_osasto_valinnat = "";
	for (let j = 0; j < osasto_idt.length; j++) {
		if (Object.keys(suunnittelu_osasto_tiedot).indexOf(osasto_idt[j]) != -1) {
			let osasto_tiedot = suunnittelu_osasto_tiedot[osasto_idt[j]];
			let aktiivinen = "";
			if (osasto_tiedot.aktiivinen == 0) {
				aktiivinen = " disabled";
			}

			sijaisen_osasto_valinnat +=
				"<option value='" +
				osasto_tiedot.id +
				"' style='background-color:" +
				osasto_tiedot.taustavari +
				"'" +
				aktiivinen +
				">" +
				osasto_tiedot.raporttinumero +
				" " +
				osasto_tiedot.lyhenne +
				"</option>";
		}
	}

	$.post(
		"php/hae_kiinnitykset.php",
		{ id: suunniteltuvuoro_id },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let kiinnitysdata = JSON.parse(reply);
				let kiinnitykset = kiinnitysdata["kiinnitykset"];
				let kiinnitykset_julkaistu = kiinnitysdata["kiinnitykset_julkaistu"];
				$("#vuorokiinnitykset").data(
					"kiinnitykset_julkaistu",
					kiinnitykset_julkaistu
				);

				for (let i = 0; i < kiinnitykset.length; i++) {
					let vuoro_id = kiinnitykset[i].id;
					let vuoro_luku = kiinnitykset[i].luku;
					let vuoro_tyyppi = kiinnitykset[i].vuorotyyppi;
					let vuoro_raportti_osasto_id = kiinnitykset[i].raportti_osasto_id;
					let vuoro_osasto_id = kiinnitykset[i].osasto_id;
					let vuoro_tausta_id = kiinnitykset[i].tausta_id;
					let vuoro_tausta_kommentti = kiinnitykset[i].tausta_kommentti;
					let vuoro_lukituskuvake =
						vuoro_luku == 1
							? " vuorolukituskuvake_lukittu"
							: " vuorolukituskuvake_avattu";

					$("#vuorokiinnitykset").append(
						"<tr id='suunnittelu_kiinnitykset_rivi_" +
							i +
							"' class='suunnittelu_kiinnitykset_rivi'>" +
							"<td class='teksti_keskella'><div id='suunnittelu_vuoro_lukitus_" +
							i +
							"' class='vuorolukituskuvake" +
							vuoro_lukituskuvake +
							"' data-arvo='" +
							vuoro_luku +
							"'></div></td>" +
							"<td class='teksti_keskella'><span id='suunnittelu_vuorotyyppi_" +
							i +
							"'>" +
							vuoro_tyyppi +
							"</span></td>" +
							"<td><select id='suunnittelu_raportti_osasto_id_" +
							i +
							"' title='Raporttiosasto' data-arvo='" +
							vuoro_raportti_osasto_id +
							"'></select></td>" +
							"<td><select id='suunnittelu_osasto_id_" +
							i +
							"' title='Sijaisuusosasto' data-arvo='" +
							vuoro_osasto_id +
							"'></select></td>" +
							"<td><select id='suunnittelu_tausta_id_" +
							i +
							"' title='Sijaisuustausta' data-arvo='" +
							vuoro_tausta_id +
							"'></select></td>" +
							"<td><input id='suunnittelu_tausta_kommentti_" +
							i +
							"' title='Kommentti' data-arvo='" +
							vuoro_tausta_kommentti +
							"' /></td>" +
							"</tr>"
					);

					$("#suunnittelu_kiinnitykset_rivi_" + i).data("vuoro_id", vuoro_id);
					$("#suunnittelu_vuoro_lukitus_" + i).data("lukitus", vuoro_luku);
					$("#suunnittelu_vuoro_lukitus_" + i).click(function (
						painiketoiminta
					) {
						painiketoiminta.stopPropagation();
						if ($(this).data("lukitus") == 1) {
							$(this).data("lukitus", 0);
							$(this).removeClass("vuorolukituskuvake_lukittu");
							$(this).addClass("vuorolukituskuvake_avattu");
						} else {
							$(this).data("lukitus", 1);
							$(this).removeClass("vuorolukituskuvake_avattu");
							$(this).addClass("vuorolukituskuvake_lukittu");
						}
					});

					$("#suunnittelu_raportti_osasto_id_" + i).html(osasto_valinnat);
					$("#suunnittelu_raportti_osasto_id_" + i).prop("selectedIndex", 0);
					$("#suunnittelu_raportti_osasto_id_" + i).val(
						vuoro_raportti_osasto_id
					);

					if (vuoro_raportti_osasto_id != 0) {
						$("#suunnittelu_raportti_osasto_id_" + i).css(
							"background-color",
							suunnittelu_osasto_varit[vuoro_raportti_osasto_id]
						);
					} else {
						$("#suunnittelu_raportti_osasto_id_" + i).css(
							"background-color",
							"#ffffff"
						);
					}

					$("#suunnittelu_raportti_osasto_id_" + i).change(function () {
						let v_id = $(this)
							.prop("id")
							.replace("suunnittelu_raportti_osasto_id_", "");
						let valittu_arvo = $(
							"#suunnittelu_raportti_osasto_id_" + v_id
						).val();
						if (valittu_arvo != 0) {
							$("#suunnittelu_raportti_osasto_id_" + v_id).css(
								"background-color",
								suunnittelu_osasto_varit[valittu_arvo]
							);
						} else {
							$("#suunnittelu_raportti_osasto_id_" + v_id).css(
								"background-color",
								"#ffffff"
							);
						}
					});

					$("#suunnittelu_osasto_id_" + i).html(
						"<option value='0' style='background-color:#ffffff'></option>"
					);
					$("#suunnittelu_osasto_id_" + i).append(
						suunnittelu_osasto_valinta_tiedot[0]
					);
					$("#suunnittelu_osasto_id_" + i).append(sijaisen_osasto_valinnat);
					$("#suunnittelu_osasto_id_" + i).prop("selectedIndex", 0);
					$("#suunnittelu_osasto_id_" + i).val(vuoro_osasto_id);

					if (vuoro_osasto_id != 0) {
						$("#suunnittelu_osasto_id_" + i).css(
							"background-color",
							suunnittelu_osasto_varit[vuoro_osasto_id]
						);
					} else {
						$("#suunnittelu_osasto_id_" + i).css("background-color", "#ffffff");
					}

					$("#suunnittelu_osasto_id_" + i).change(function () {
						let v_id = $(this).prop("id").replace("suunnittelu_osasto_id_", "");

						let osasto_valinta = $("#suunnittelu_osasto_id_" + v_id).val();
						if (
							$("#suunnittelu_raportti_osasto_id_" + v_id).val() !=
							osasto_valinta
						) {
							$("#suunnittelu_raportti_osasto_id_" + v_id)
								.val(osasto_valinta)
								.change();
						}

						let valittu_arvo = $("#suunnittelu_osasto_id_" + v_id).val();
						if (valittu_arvo != 0) {
							$("#suunnittelu_osasto_id_" + v_id).css(
								"background-color",
								suunnittelu_osasto_varit[valittu_arvo]
							);
						} else {
							$("#suunnittelu_osasto_id_" + v_id).css(
								"background-color",
								"#ffffff"
							);
						}
					});

					$("#suunnittelu_tausta_id_" + i).html(suunnittelu_tausta_valinnat);
					$("#suunnittelu_tausta_id_" + i).prop("selectedIndex", 0);
					$("#suunnittelu_tausta_id_" + i).val(vuoro_tausta_id);

					if (vuoro_tausta_id == kotiosasto_tausta_id) {
						$("#suunnittelu_tausta_id_" + i).css("background-color", "#90ff7c");
					} else {
						$("#suunnittelu_tausta_id_" + i).css("background-color", "#ffffff");
					}

					$("#suunnittelu_tausta_id_" + i).change(function () {
						let v_id = $(this).prop("id").replace("suunnittelu_tausta_id_", "");
						let valittu_arvo = $("#suunnittelu_tausta_id_" + v_id).val();
						if (valittu_arvo == kotiosasto_tausta_id) {
							$("#suunnittelu_tausta_id_" + v_id).css(
								"background-color",
								"#90ff7c"
							);
						} else {
							$("#suunnittelu_tausta_id_" + v_id).css(
								"background-color",
								"#ffffff"
							);
						}
					});

					$("#suunnittelu_tausta_kommentti_" + i).val(vuoro_tausta_kommentti);
				}
			}
		}
	);
}

function suunnittelu_tallenna_kiinnitykset() {
	const suunniteltuvuoro_id = $(
		"#vuorokiinnitykset_suunniteltuvuoro_id"
	).html();
	const suunnitellut_kiinnitykset = [];
	const vuoro_kiinnitykset = [];
	const kiinnitykset_julkaistu = $("#vuorokiinnitykset").data(
		"kiinnitykset_julkaistu"
	);
	let vuoroja_muokattu = false;

	$(".suunnittelu_kiinnitykset_rivi").each(function () {
		let rivi = $(this).prop("id").replace("suunnittelu_kiinnitykset_rivi_", "");
		let vuoro_id = $("#suunnittelu_kiinnitykset_rivi_" + rivi).data("vuoro_id");
		let rivi_luku = $("#suunnittelu_vuoro_lukitus_" + rivi).data("arvo");
		let luku = $("#suunnittelu_vuoro_lukitus_" + rivi).data("lukitus");
		let vuorotyyppi = $("#suunnittelu_vuorotyyppi_" + rivi).html();
		let rivi_raportti_osasto_id = $(
			"#suunnittelu_raportti_osasto_id_" + rivi
		).data("arvo");
		let raportti_osasto_id = $("#suunnittelu_raportti_osasto_id_" + rivi).val();
		let rivi_osasto_id = $("#suunnittelu_osasto_id_" + rivi).data("arvo");
		let osasto_id = $("#suunnittelu_osasto_id_" + rivi).val();
		let rivi_tausta_id = $("#suunnittelu_tausta_id_" + rivi).data("arvo");
		let tausta_id = $("#suunnittelu_tausta_id_" + rivi).val();
		let rivi_tausta_kommentti = $("#suunnittelu_tausta_kommentti_" + rivi).data(
			"arvo"
		);
		let tausta_kommentti = $("#suunnittelu_tausta_kommentti_" + rivi).val();

		const raportti_osasto_muokattu =
			rivi_raportti_osasto_id != raportti_osasto_id;
		const osasto_muokattu = rivi_osasto_id != osasto_id;
		const tausta_muokattu = rivi_tausta_id != tausta_id;
		const tausta_kommentti_muokattu = rivi_tausta_kommentti != tausta_kommentti;
		const luku_muokattu = rivi_luku != luku;

		suunnitellut_kiinnitykset.push({
			id: vuoro_id,
			vuorotyyppi,
			raportti_osasto_id,
			osasto_id,
			tausta_id,
			tausta_kommentti,
			luku,
		});

		if (
			raportti_osasto_muokattu ||
			osasto_muokattu ||
			tausta_muokattu ||
			tausta_kommentti_muokattu ||
			luku_muokattu
		) {
			vuoroja_muokattu = true;

			if (kiinnitykset_julkaistu) {
				vuoro_kiinnitykset.push({
					id: vuoro_id,
					vuorotyyppi,
					raportti_osasto_id,
					raportti_osasto_muokattu,
					osasto_id,
					osasto_muokattu,
					tausta_id,
					tausta_muokattu,
					tausta_kommentti,
					tausta_kommentti_muokattu,
					luku,
					luku_muokattu,
				});
			}
		}
	});

	if (vuoroja_muokattu) {
		if (kiinnitykset_julkaistu) {
			$.post(
				"php/tallenna_kiinnitykset.php",
				{
					kiinnitykset: vuoro_kiinnitykset,
					kayttajatunnus,
				},
				function (reply) {
					if (reply == "parametri") {
						alert("Parametrivirhe");
					} else if (reply.indexOf("Tietokantavirhe:") == -1) {
						$("#vuorokiinnityksetRuutu").dialog("close");
						suunnittelu_hae_suunniteltu_vuoro(suunniteltuvuoro_id);
					} else {
						alert("Tietokantavirhe");
					}
				}
			);
		} else {
			$.post(
				"php/tallenna_suunnitellut_kiinnitykset.php",
				{
					kiinnitykset: suunnitellut_kiinnitykset,
					suunniteltuvuoro_id,
				},
				function (reply) {
					if (reply == "parametri") {
						alert("Parametrivirhe");
					} else if (reply.indexOf("Tietokantavirhe:") == -1) {
						$("#vuorokiinnityksetRuutu").dialog("close");
						suunnittelu_hae_suunniteltu_vuoro(suunniteltuvuoro_id);
					} else {
						alert("Tietokantavirhe");
					}
				}
			);
		}
	} else {
		$("#vuorokiinnityksetRuutu").dialog("close");
	}
}

function suunnittelu_nayta_julkaisu() {
	if (sijaisten_idt == "-1") {
		alert("Ei julkaistavia vuoroja");
		return;
	}
	let formatFin = scheduler.date.date_to_str("%d.%m.%Y");
	$("#julkaisu_alkupvm").val(formatFin(scheduler.getState().min_date));
	$("#julkaisu_loppupvm").val("");
	$("#julkaisu_nakyvyys").val(1);

	$("#julkaisuRuutu").dialog("open");
}

function suunnittelu_julkaise_vuorot() {
	if (
		$("#julkaisu_alkupvm").val() == "" ||
		$("#julkaisu_loppupvm").val() == ""
	) {
		alert("Tarkista julkaisu ajanjakso");
		return;
	}
	$("#julkaisuLatausAnimaatio").show();

	const nakyvyys = $("#julkaisu_nakyvyys").val();
	const alku_pvm = $("#julkaisu_alkupvm").val();
	const loppu_pvm = $("#julkaisu_loppupvm").val();

	$("#julkaisuyhteenveto_poistetut").html("");
	$("#julkaisuyhteenveto_paivitetyt").html("");
	$("#julkaisuyhteenveto_luodut").html("");
	$("#julkaisuyhteenveto_yhteensa").html("");
	$("#julkaisuyhteenveto_kiinnitykset").html("");

	$.post(
		"php/julkaise_vuorot.php",
		{
			nakyvyys,
			alkupvm: alku_pvm,
			loppupvm: loppu_pvm,
			sijainen_idt: sijaisten_idt,
			kayttaja: kayttajatunnus,
		},
		function (reply) {
			$("#julkaisuLatausAnimaatio").hide();
			$("#julkaisuRuutu").dialog("close");

			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				$("#julkaisuyhteenveto_poistetut").html(replyObj[0].poistetut);
				$("#julkaisuyhteenveto_paivitetyt").html(replyObj[0].paivitetyt);
				$("#julkaisuyhteenveto_luodut").html(replyObj[0].luodut);
				$("#julkaisuyhteenveto_yhteensa").html(replyObj[0].yhteensa);
				$("#julkaisuyhteenveto_kiinnitykset").html(replyObj[0].kiinnitykset);
				$("#julkaisuYhteenvetoRuutu").dialog("open");
				suunnittelu_hae_suunnitellut_vuorot();
				nayta_tilaviesti("Vuorot julkaistu");
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function suunnittelu_nayta_vuorolukitukset() {
	$("#vuorolukitukset_tallennusrivi").hide();
	suunnittelu_hae_vuorolukitukset();
	$("#vuorolukituksetRuutu").dialog("open");
}

function suunnittelu_hae_vuorolukitukset() {
	if (
		$("#vuorolukitukset_data").find("#vuorolukitukset_tallennusrivi").length > 0
	) {
		let tallennusrivi = $("#vuorolukitukset_tallennusrivi");
		$("#vuorolukitukset_tallennusrivi").detach();
		tallennusrivi.insertAfter($("#vuorolukitukset_otsikkorivi"));
	}

	$("#vuorolukitukset_data").html("");

	$.post("php/hae_vuorolukitukset.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			for (let i = 0; i < replyObj.length; i++) {
				let id = replyObj[i].id;
				let vuorolukitus_rivi = $(
					"<tr id='vuorolukitukset_rivi_" +
						id +
						"' class='vuorolukitus_rivi'></tr>"
				);
				vuorolukitus_rivi.data("vuorolukitus_id", id);
				vuorolukitus_rivi.html(
					"<td><span id='vuorolukitukset_vuorotyyppi_" +
						id +
						"'>" +
						replyObj[i].vuorotyyppi +
						"</span></td>" +
						"<td><span id='vuorolukitukset_raportti_osasto_id_" +
						id +
						"'>" +
						replyObj[i].raportti_osasto_nimi +
						"</span></td>" +
						"<td><span id='vuorolukitukset_osasto_id_" +
						id +
						"'>" +
						replyObj[i].osasto_nimi +
						"</span></td>" +
						"<td><button id='vuorolukitukset_muokkaa_" +
						id +
						"' class='painike'>Muokkaa</button></td>" +
						"<td><button id='vuorolukitukset_poista_" +
						id +
						"' class='painike'>Poista</button></td>"
				);

				$("#vuorolukitukset_data").append(vuorolukitus_rivi);

				$("#vuorolukitukset_raportti_osasto_id_" + id).data(
					"id",
					replyObj[i].raportti_osasto_id
				);
				if (replyObj[i].raportti_osasto_id == -1) {
					$("#vuorolukitukset_raportti_osasto_id_" + id).html(
						"Sissin Kotiosasto"
					);
				}

				$("#vuorolukitukset_osasto_id_" + id).data("id", replyObj[i].osasto_id);

				$("#vuorolukitukset_muokkaa_" + id).click(function () {
					suunnittelu_nayta_vuorolukitukset_tallennus(
						$(this).closest("tr").data("vuorolukitus_id")
					);
				});

				$("#vuorolukitukset_poista_" + id).click(function () {
					suunnittelu_nayta_vuorolukitus_poisto(
						$(this).closest("tr").data("vuorolukitus_id")
					);
				});
			}

			$("#vuorolukitukset_data button").button();
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function suunnittelu_nayta_vuorolukitukset_tallennus(vuorolukitus_id) {
	$("#vuorolukitusPoistoRuutu").dialog("close");
	if (vuorolukitus_id == "") {
		$(".vuorolukitus_muokkaus").removeClass("vuorolukitus_muokkaus");
		$("#vuorolukitukset_tallennusrivi").data("vuorolukitus_id", "");
		$("#vuorolukitukset_vuorotyyppi_tallennusrivi").val("");
		$("#vuorolukitukset_raportti_osasto_id_tallennusrivi").val("");
		$("#vuorolukitukset_osasto_id_tallennusrivi").val("");
		let tallennusrivi = $("#vuorolukitukset_tallennusrivi");
		$("#vuorolukitukset_tallennusrivi").detach();
		tallennusrivi.insertAfter($("#vuorolukitukset_otsikkorivi"));
	} else {
		let tallennusrivi = $("#vuorolukitukset_tallennusrivi");
		$("#vuorolukitukset_tallennusrivi").detach();
		tallennusrivi.insertAfter($("#vuorolukitukset_rivi_" + vuorolukitus_id));
		$(".vuorolukitus_muokkaus").removeClass("vuorolukitus_muokkaus");
		$("#vuorolukitukset_rivi_" + vuorolukitus_id).addClass(
			"vuorolukitus_muokkaus"
		);
		$("#vuorolukitukset_tallennusrivi").data(
			"vuorolukitus_id",
			vuorolukitus_id
		);
		$("#vuorolukitukset_vuorotyyppi_tallennusrivi").val(
			$("#vuorolukitukset_vuorotyyppi_" + vuorolukitus_id).html()
		);
		$("#vuorolukitukset_raportti_osasto_id_tallennusrivi").val(
			$("#vuorolukitukset_raportti_osasto_id_" + vuorolukitus_id).data("id")
		);
		$("#vuorolukitukset_osasto_id_tallennusrivi").val(
			$("#vuorolukitukset_osasto_id_" + vuorolukitus_id).data("id")
		);
	}

	$("#vuorolukitukset_tallennusrivi").show();
}

function suunnittelu_tallenna_vuorolukitus() {
	let vl_id = $("#vuorolukitukset_tallennusrivi").data("vuorolukitus_id");
	let vl_vuorotyyppi = $("#vuorolukitukset_vuorotyyppi_tallennusrivi").val();
	let vl_raportti_osasto_id = $(
		"#vuorolukitukset_raportti_osasto_id_tallennusrivi"
	).val();
	let vl_osasto_id = $("#vuorolukitukset_osasto_id_tallennusrivi").val();

	if (
		vl_vuorotyyppi != "" &&
		vl_raportti_osasto_id != "" &&
		vl_osasto_id != ""
	) {
		$.post(
			"php/tallenna_vuorolukitus.php",
			{
				id: vl_id,
				vuorotyyppi: vl_vuorotyyppi,
				raportti_osasto_id: vl_raportti_osasto_id,
				osasto_id: vl_osasto_id,
			},
			function (reply) {
				if (reply == "parametri") {
					alert("Parametrivirhe");
				} else if (reply == "olemassa") {
					alert("Tyyppi on jo olemassa");
				} else if (reply.indexOf("Tietokantavirhe:") == -1) {
					$("#vuorolukitukset_tallennusrivi").data("vuorolukitus_id", "");
					$("#vuorolukitukset_vuorotyyppi_tallennusrivi").val("");
					$("#vuorolukitukset_raportti_osasto_id_tallennusrivi").val("");
					$("#vuorolukitukset_osasto_id_tallennusrivi").val("");

					$("#vuorolukitukset_tallennusrivi").hide();
					suunnittelu_hae_vuorolukitukset();
				} else {
					alert("Tietokantavirhe");
				}
			}
		);
	} else {
		alert("Tarkista tiedot");
	}
}

function suunnittelu_peruuta_vuorolukitus_tallennus() {
	$(".vuorolukitus_muokkaus").removeClass("vuorolukitus_muokkaus");
	$("#vuorolukitukset_tallennusrivi").hide();
}

function suunnittelu_nayta_vuorolukitus_poisto(vuorolukitus_id) {
	$("#vuorolukitukset_tallennusrivi").hide();
	$("#vuorolukituspoistoid").html(vuorolukitus_id);
	$(".vuorolukitus_poisto").removeClass("vuorolukitus_poisto");
	$("#vuorolukitukset_rivi_" + vuorolukitus_id).addClass("vuorolukitus_poisto");
	let teksti =
		"Haluatko poistaa " +
		$("#vuorolukitukset_vuorotyyppi_" + vuorolukitus_id).html() +
		" vuorolukituksen ?";
	$("#vuorolukitusPoistoRuutu").dialog("option", "title", teksti);
	$("#vuorolukitusPoistoRuutu").dialog("open");
}

function suunnittelu_peruuta_vuorolukitus_poisto() {
	$(".vuorolukitus_poisto").removeClass("vuorolukitus_poisto");
	$("#vuorolukitusPoistoRuutu").dialog("close");
}

function suunnittelu_poista_vuorolukitus() {
	let vl_id = $("#vuorolukituspoistoid").html();

	if (vl_id == "") {
		alert("Id virhe");
		return;
	}

	$.post("php/poista_vuorolukitus.php", { id: vl_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			nayta_tilaviesti("Vuorolukituksen poisto onnistui");
			$("#vuorolukituspoistoid").html("");

			suunnittelu_hae_vuorolukitukset();
			$("#vuorolukitusPoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function suunnittelu_nayta_vuoroyhdistelmat() {
	$("#vuoroyhdistelmat_tallennusrivi").hide();
	suunnittelu_hae_vuoroyhdistelmat();
	$("#vuoroyhdistelmatRuutu").dialog("open");
}

function suunnittelu_hae_vuoroyhdistelmat() {
	if (
		$("#vuoroyhdistelmat_data").find("#vuoroyhdistelmat_tallennusrivi").length >
		0
	) {
		let tallennusrivi = $("#vuoroyhdistelmat_tallennusrivi");
		$("#vuoroyhdistelmat_tallennusrivi").detach();
		tallennusrivi.insertAfter($("#vuoroyhdistelmat_otsikkorivi"));
	}

	$("#vuoroyhdistelmat_data").html("");

	$.post("php/hae_vuoroyhdistelmat.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			for (let i = 0; i < replyObj.length; i++) {
				let id = replyObj[i].id;
				let vuoroyhdistelma_rivi = $(
					"<tr id='vuoroyhdistelmat_rivi_" +
						id +
						"' class='vuoroyhdistelma_rivi'></tr>"
				);
				vuoroyhdistelma_rivi.data("vuoroyhdistelma_id", id);
				vuoroyhdistelma_rivi.html(
					"<td><span id='vuoroyhdistelmat_tyyppi_" +
						id +
						"'>" +
						replyObj[i].tyyppi +
						"</span></td>" +
						"<td><span id='vuoroyhdistelmat_vuorotyypit_" +
						id +
						"' class='vuorotyyppi_kuvake'>" +
						replyObj[i].vuorotyypit +
						"</span></td>" +
						"<td><span id='vuoroyhdistelmat_kuvaus_" +
						id +
						"'>" +
						replyObj[i].kuvaus +
						"</span></td>" +
						"<td><span id='vuoroyhdistelmat_vari_esikatselu_" +
						id +
						"' class='vari_hex_esikatselu' style='background:" +
						replyObj[i].vari_hex +
						"; color:" +
						replyObj[i].vari_hex +
						"'>" +
						replyObj[i].vari_hex +
						"</span></td>" +
						"<td><button id='vuoroyhdistelmat_muokkaa_" +
						id +
						"' class='painike'>Muokkaa</button></td>" +
						"<td><button id='vuoroyhdistelmat_poista_" +
						id +
						"' class='painike'>Poista</button></td>"
				);

				$("#vuoroyhdistelmat_data").append(vuoroyhdistelma_rivi);

				if ($("#vuorotaustavari_valinta").prop("checked") == true) {
					$("#vuoroyhdistelmat_vuorotyypit_" + id).css({
						"background-color": replyObj[i].vari_hex,
					});
				}

				$("#vuoroyhdistelmat_muokkaa_" + id).click(function () {
					suunnittelu_nayta_vuoroyhdistelma_tallennus(
						$(this).closest("tr").data("vuoroyhdistelma_id")
					);
				});

				$("#vuoroyhdistelmat_poista_" + id).click(function () {
					suunnittelu_nayta_vuoroyhdistelma_poisto(
						$(this).closest("tr").data("vuoroyhdistelma_id")
					);
				});
			}

			$("#vuoroyhdistelmat_data button").button();
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function suunnittelu_nayta_vuoroyhdistelma_tallennus(vuoroyhdistelma_id) {
	$("#vuoroyhdistelmaPoistoRuutu").dialog("close");
	if (vuoroyhdistelma_id == "") {
		$("#vuoroyhdistelmat_tallennusrivi").data("vuoroyhdistelma_id", "");
		$("#vuoroyhdistelmat_tyyppi_tallennusrivi").val("");
		$("#vuoroyhdistelmat_vuorotyypit_tallennusrivi").val("");
		$("#vuoroyhdistelmat_kuvaus_tallennusrivi").val("");
		$("#vuoroyhdistelmat_vari_esikatselu_tallennusrivi").css(
			"background-color",
			"#ffffff"
		);
		$("#vuoroyhdistelmat_vari_esikatselu_tallennusrivi").data(
			"vari",
			"#ffffff"
		);
		$(".vuoroyhdistelma_muokkaus").removeClass("vuoroyhdistelma_muokkaus");
		let tallennusrivi = $("#vuoroyhdistelmat_tallennusrivi");
		$("#vuoroyhdistelmat_tallennusrivi").detach();
		tallennusrivi.insertAfter($("#vuoroyhdistelmat_otsikkorivi"));
	} else {
		let tallennusrivi = $("#vuoroyhdistelmat_tallennusrivi");
		$("#vuoroyhdistelmat_tallennusrivi").detach();
		tallennusrivi.insertAfter(
			$("#vuoroyhdistelmat_rivi_" + vuoroyhdistelma_id)
		);
		$(".vuoroyhdistelma_muokkaus").removeClass("vuoroyhdistelma_muokkaus");
		$("#vuoroyhdistelmat_rivi_" + vuoroyhdistelma_id).addClass(
			"vuoroyhdistelma_muokkaus"
		);
		$("#vuoroyhdistelmat_tallennusrivi").data(
			"vuoroyhdistelma_id",
			vuoroyhdistelma_id
		);
		$("#vuoroyhdistelmat_tyyppi_tallennusrivi").val(
			$("#vuoroyhdistelmat_tyyppi_" + vuoroyhdistelma_id).html()
		);
		$("#vuoroyhdistelmat_vuorotyypit_tallennusrivi").val(
			$("#vuoroyhdistelmat_vuorotyypit_" + vuoroyhdistelma_id).html()
		);
		$("#vuoroyhdistelmat_kuvaus_tallennusrivi").val(
			$("#vuoroyhdistelmat_kuvaus_" + vuoroyhdistelma_id).html()
		);
		let vari = $(
			"#vuoroyhdistelmat_vari_esikatselu_" + vuoroyhdistelma_id
		).html();
		$("#vuoroyhdistelmat_vari_esikatselu_tallennusrivi").css(
			"background-color",
			vari
		);
		$("#vuoroyhdistelmat_vari_esikatselu_tallennusrivi").data("vari", vari);
	}

	$("#vuoroyhdistelmat_tallennusrivi").show();
}

function suunnittelu_tallenna_vuoroyhdistelma() {
	let vy_id = $("#vuoroyhdistelmat_tallennusrivi").data("vuoroyhdistelma_id");
	let vy_tyyppi = $("#vuoroyhdistelmat_tyyppi_tallennusrivi").val();
	let vy_vuorotyypit = $("#vuoroyhdistelmat_vuorotyypit_tallennusrivi").val();
	let vy_kuvaus = $("#vuoroyhdistelmat_kuvaus_tallennusrivi").val();
	let vy_vari_hex = $("#vuoroyhdistelmat_vari_esikatselu_tallennusrivi").data(
		"vari"
	);

	if (vy_tyyppi != "" && vy_vuorotyypit != "") {
		$.post(
			"php/tallenna_vuoroyhdistelma.php",
			{
				id: vy_id,
				tyyppi: vy_tyyppi,
				vuorotyypit: vy_vuorotyypit,
				kuvaus: vy_kuvaus,
				vari_hex: vy_vari_hex,
			},
			function (reply) {
				if (reply == "parametri") {
					alert("Parametrivirhe");
				} else if (reply == "olemassa") {
					alert("Tyyppi on jo olemassa");
				} else if (reply.indexOf("Tietokantavirhe:") == -1) {
					$("#vuoroyhdistelmat_tallennusrivi").data("vuoroyhdistelma_id", "");
					$("#vuoroyhdistelmat_vuorotyypit_tallennusrivi").val("");
					$("#vuoroyhdistelmat_tyyppi_tallennusrivi").val("");
					$("#vuoroyhdistelmat_kuvaus_tallennusrivi").val("");
					$("#vuoroyhdistelmat_vari_esikatselu_tallennusrivi").css(
						"background-color",
						"#ffffff"
					);
					$("#vuoroyhdistelmat_vari_esikatselu_tallennusrivi").data(
						"vari",
						"#ffffff"
					);

					$("#vuoroyhdistelmat_tallennusrivi").hide();
					suunnittelu_hae_vuoroyhdistelmat();
					suunnittelu_hae_suunnittelu_vuorotyyppit();
				} else {
					alert("Tietokantavirhe");
				}
			}
		);
	} else {
		alert("Tarkista tyypit");
	}
}

function suunnittelu_peruuta_vuoroyhdistelma_tallennus() {
	$(".vuoroyhdistelma_muokkaus").removeClass("vuoroyhdistelma_muokkaus");
	$("#vuoroyhdistelmat_tallennusrivi").hide();
}

function suunnittelu_nayta_vuoroyhdistelma_poisto(vuoroyhdistelma_id) {
	$("#vuoroyhdistelmat_tallennusrivi").hide();
	$("#vuoroyhdistelmapoistoid").html(vuoroyhdistelma_id);
	$(".vuoroyhdistelma_poisto").removeClass("vuoroyhdistelma_poisto");
	$("#vuoroyhdistelmat_rivi_" + vuoroyhdistelma_id).addClass(
		"vuoroyhdistelma_poisto"
	);
	let teksti =
		"Haluatko poistaa " +
		$("#vuoroyhdistelmat_tyyppi_" + vuoroyhdistelma_id).html() +
		" = " +
		$("#vuoroyhdistelmat_vuorotyypit_" + vuoroyhdistelma_id).html() +
		" vuoroyhdistelmän ?";
	$("#vuoroyhdistelmaPoistoRuutu").dialog("option", "title", teksti);
	$("#vuoroyhdistelmaPoistoRuutu").dialog("open");
}

function suunnittelu_peruuta_vuoroyhdistelma_poisto() {
	$(".vuoroyhdistelma_poisto").removeClass("vuoroyhdistelma_poisto");
	$("#vuoroyhdistelmaPoistoRuutu").dialog("close");
}

function suunnittelu_poista_vuoroyhdistelma() {
	let vy_id = $("#vuoroyhdistelmapoistoid").html();

	if (vy_id == "") {
		alert("Id virhe");
		return;
	}

	$.post("php/poista_vuoroyhdistelma.php", { id: vy_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			if (replyObj[0].virhe == 0) {
				nayta_tilaviesti("Vuoroyhdistelmän poisto onnistui");
				$("#vuoroyhdistelmapoistoid").html("");

				suunnittelu_hae_vuoroyhdistelmat();
				suunnittelu_hae_suunnittelu_vuorotyyppit();
				$("#vuoroyhdistelmaPoistoRuutu").dialog("close");
			} else {
				nayta_tilaviesti("Vuoroyhdistelmä on käytössä, sitä ei voi poistaa.");
				$("#vuoroyhdistelmaPoistoRuutu").dialog("close");
			}
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function suunnittelu_vaihda_vuoro_tilaa() {
	if (sijaisten_idt == -1) {
		$("#suunnittelu_vuoro_painike").prop("disabled", true);
	} else {
		$("#suunnittelu_vuoro_painike").prop("disabled", false);
	}

	suunnittelu_aseta_vuoro_muokkaus_tila(!suunnittelu_vuoro_muokkaus_tila);
}

function suunnittelu_aseta_vuoro_muokkaus_tila(tila) {
	solu_valittu = false;
	valittu_pvm = "";
	valittu_suunniteltuvuoro_id = "";
	valittu_rivinumero = -1;
	valittu_sijainen_id = -1;
	scheduler.updateView();

	if (suunnittelu_vuoro_vaihto_tila) {
		suunnittelu_aseta_vuoro_vaihto_tila(false);
	}

	if (tila) {
		suunnittelu_vuoro_muokkaus_tila = true;
		$("#suunnittelu_vuoro_painike").css({
			color: "green",
			border: "1px solid green",
		});
	} else {
		suunnittelu_vuoro_muokkaus_tila = false;
		$("#suunnittelu_vuoro_painike").css({
			color: "red",
			border: "1px solid red",
		});
		viimeisin_suunniteltuvuoro_pvm = "";
	}
}

function suunnittelu_vaihda_kiinnitys_tilaa() {
	if (sijaisten_idt == -1) {
		$("#suunnittelu_vuoro_painike").prop("disabled", true);
	} else {
		$("#suunnittelu_vuoro_painike").prop("disabled", false);
	}

	suunnittelu_aseta_kiinnitys_muokkaus_tila(
		!suunnittelu_kiinnitys_muokkaus_tila
	);
}

function suunnittelu_aseta_kiinnitys_muokkaus_tila(tila) {
	solu_valittu = false;
	valittu_pvm = "";
	valittu_suunniteltuvuoro_id = "";
	valittu_rivinumero = -1;
	valittu_sijainen_id = -1;
	scheduler.updateView();

	$("#vuorokiinnitykset_suunniteltuvuoro_id").html("");

	if (suunnittelu_vuoro_vaihto_tila) {
		suunnittelu_aseta_vuoro_vaihto_tila(false);
	}

	if (tila) {
		suunnittelu_kiinnitys_muokkaus_tila = true;
		$("#suunnittelu_kiinnitys_painike").css({
			color: "green",
			border: "1px solid green",
		});
	} else {
		suunnittelu_kiinnitys_muokkaus_tila = false;
		$("#suunnittelu_kiinnitys_painike").css({
			color: "red",
			border: "1px solid red",
		});
	}
}

function suunnittelu_vaihda_vaihto_tilaa() {
	if (sijaisten_idt == -1) {
		$("#suunnittelu_vaihto_painike").prop("disabled", true);
	} else {
		$("#suunnittelu_vaihto_painike").prop("disabled", false);
	}

	suunnittelu_aseta_vuoro_vaihto_tila(!suunnittelu_vuoro_vaihto_tila);
}

function suunnittelu_aseta_vuoro_vaihto_tila(tila) {
	solu_valittu = false;
	valittu_pvm = "";
	valittu_suunniteltuvuoro_id = "";
	valittu_rivinumero = -1;
	valittu_sijainen_id = -1;
	suunnittelu_vuoro_vaihto_tiedot = [];
	scheduler.updateView();

	if (suunnittelu_vuoro_muokkaus_tila) {
		suunnittelu_aseta_vuoro_muokkaus_tila(false);
	}

	if (suunnittelu_kiinnitys_muokkaus_tila) {
		suunnittelu_aseta_kiinnitys_muokkaus_tila(false);
	}

	if (tila) {
		suunnittelu_vuoro_vaihto_tila = true;
		$("#suunnittelu_vaihto_painike").css({
			color: "green",
			border: "1px solid green",
		});
	} else {
		suunnittelu_vuoro_vaihto_tila = false;
		$("#suunnittelu_vaihto_painike").css({
			color: "red",
			border: "1px solid red",
		});
	}
}

function suunnittelu_suorita_vuoro_vaihto(
	l_suunniteltuvuoro_id,
	l_sijainen_id,
	l_pvm,
	k_suunniteltuvuoro_id,
	k_sijainen_id,
	k_pvm
) {
	let dateTimeFormat = scheduler.date.date_to_str("%Y-%m-%d %H:%i");
	let l_alku_pvm = dateTimeFormat(l_pvm);
	let k_alku_pvm = dateTimeFormat(k_pvm);
	let l_loppu_pvm = dateTimeFormat(scheduler.date.add(l_pvm, 1, "day"));
	let k_loppu_pvm = dateTimeFormat(scheduler.date.add(k_pvm, 1, "day"));

	$.post(
		"php/suorita_suunniteltuvuoro_vaihto.php",
		{
			lahde_suunniteltuvuoro_id: l_suunniteltuvuoro_id,
			lahde_sijainen_id: l_sijainen_id,
			lahde_alku_pvm: l_alku_pvm,
			lahde_loppu_pvm: l_loppu_pvm,
			kohde_suunniteltuvuoro_id: k_suunniteltuvuoro_id,
			kohde_sijainen_id: k_sijainen_id,
			kohde_alku_pvm: k_alku_pvm,
			kohde_loppu_pvm: k_loppu_pvm,
			kayttaja: kayttajatunnus,
		},
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				solu_valittu = false;
				valittu_pvm = "";
				valittu_suunniteltuvuoro_id = "";
				valittu_rivinumero = -1;
				valittu_sijainen_id = -1;
				scheduler.updateView();

				suunnittelu_hae_suunnitellut_vuorot();
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function suunnittelu_vaihda_nakyma(hoitajatila) {
	$("#suunnittelunakymapikavalinnat button").removeClass(
		"painike_valittu_tila"
	);
	if (hoitajatila) {
		$("#suunnittelu_nakyma_suodatin").val(1).change();
		$("#suunnittelunakymapikavalinta_hoitaja").addClass("painike_valittu_tila");
	} else {
		$("#suunnittelu_nakyma_suodatin").val(0).change();
		$("#suunnittelunakymapikavalinta_sihteeri").addClass(
			"painike_valittu_tila"
		);
	}
}

function suunnittelu_vaihda_nakymaa() {
	let nakyma = $("#suunnittelu_nakymavalinta").val();
	if (nakyma == 3) {
		scheduler.matrix.timeline.x_size = 21;
	} else if (nakyma == 6) {
		scheduler.matrix.timeline.x_size = 42;
	} else {
		scheduler.matrix.timeline.x_size = 63;
	}

	scheduler.updateView();
	suunnittelu_hae_suunnitellut_vuorot();
}

function suunnittelu_nayta_vuorovaraukset() {
	suunnittelu_hae_vuorovaraus_viesit();
	$("#vuorovaraus_poista_painike").css("visibility", "hidden");
	$("#vuorovaraus_sijaiset").html("");
	$("#vuorovaraus_kaikki_valinta").prop("checked", false);
	$("#vuorovarausRuutu").dialog("open");
}

function suunnittelu_hae_vuorovaraus_viesit() {
	$("#vuorovaraus_viestit").html("<option value='-1'>Valitse viesti</option>");
	$("#vuorovaraus_viestit").val(-1);

	$.post("php/hae_vuorovaraus_viestit.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);

			for (let i = 0; i < replyObj.length; i++) {
				$("#vuorovaraus_viestit").append(
					"<option value='" +
						replyObj[i].viesti +
						"'>" +
						replyObj[i].viesti +
						"</option>"
				);
			}
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function suunnittelu_vuorovaraus_valitse_kaikki() {
	let aseta_valinta = false;
	if ($("#vuorovaraus_kaikki_valinta").prop("checked") == true) {
		aseta_valinta = true;
		if ($("#vuorovaraus_sijaiset").html() != "") {
			$("#vuorovaraus_poista_painike").css("visibility", "visible");
		}
	}
	$("#vuorovaraus_sijaiset input").each(function () {
		$(this).prop("checked", aseta_valinta);
	});

	if (aseta_valinta == false) {
		$("#vuorovaraus_poista_painike").css("visibility", "hidden");
	}
}

function suunnittelu_nayta_vuorovaraus_sijaiset() {
	$("#vuorovaraus_sijaiset").html("");
	let viestiteksti = $("#vuorovaraus_viestit").val();

	if (viestiteksti != -1) {
		$.post(
			"php/hae_vuorovaraus_sijaiset.php",
			{ viesti: viestiteksti },
			function (reply) {
				if (reply == "parametri") {
					alert("Parametrivirhe");
				} else if (reply.indexOf("Tietokantavirhe:") == -1) {
					let replyObj = JSON.parse(reply);

					for (let i = 0; i < replyObj.length; i++) {
						let tila = "Ei vastausta";
						if (replyObj[i].tila == 0) {
							tila = "Ei";
						} else if (replyObj[i].tila == 1) {
							tila = "Kyllä";
						}

						$("#vuorovaraus_sijaiset").append(
							"<div id='vuorovaraus_sijainenkehys_" +
								replyObj[i].id +
								"' class='vuorovaraus_kehys'>" +
								"<input id='vuorovaraus_sijainen_valinta_" +
								replyObj[i].id +
								"' type='checkbox' onclick='suunnittelu_tarkista_vuorovaraus_sijaisvalinnat()'/>" +
								"<span>" +
								replyObj[i].nimi +
								" - " +
								tila +
								"</span>" +
								"</div>"
						);
					}
				} else {
					alert("Tietokantavirhe");
				}
			}
		);
	}
}

function suunnittelu_tarkista_vuorovaraus_sijaisvalinnat() {
	if ($("#vuorovaraus_sijaiset input[type=checkbox]:checked").length > 0) {
		$("#vuorovaraus_poista_painike").css("visibility", "visible");
	} else {
		$("#vuorovaraus_poista_painike").css("visibility", "hidden");
	}

	if (
		$("#vuorovaraus_sijaiset input[type=checkbox]:checked").length ==
		$("#vuorovaraus_sijaiset input[type=checkbox]").length
	) {
		$("#vuorovaraus_kaikki_valinta").prop("checked", true);
	} else {
		$("#vuorovaraus_kaikki_valinta").prop("checked", false);
	}
}

function suunnittelu_nayta_vuorovaraus_poistoruutu() {
	$("#vuorovarauspoistoRuutu").dialog("open");
}

function suunnittelu_poista_vuorovaraus_viestit() {
	let v_vuorovaraus_idt = "";
	$("#vuorovaraus_sijaiset input:checked").each(function () {
		v_vuorovaraus_idt +=
			",'" +
			$(this).prop("id").replace("vuorovaraus_sijainen_valinta_", "") +
			"'";
	});

	if (v_vuorovaraus_idt.length > 0) {
		v_vuorovaraus_idt = v_vuorovaraus_idt.substr(1);
	}

	$.post(
		"php/poista_vuorovaraus_viesti.php",
		{ vuorovaraus_idt: v_vuorovaraus_idt },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				suunnittelu_hae_vuorovaraus_viesit();
				$("#vuorovaraus_poista_painike").css("visibility", "hidden");
				$("#vuorovaraus_sijaiset").html("");
				$("#vuorovaraus_kaikki_valinta").prop("checked", false);
				$("#vuorovarauspoistoRuutu").dialog("close");
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

/************************************ JÄRJESTELMÄNHALLINTA *************************************/
function alusta_jarjestelmanhallinta() {
	if (!hallinta_alustettu) {
		//Alustaa hakusanakentän
		$("#hakukentta").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 13) {
				hallinta_hae_tiedot();
			}
		});

		//Alusta värivalitsijat
		$("#toimialuevari").varivalinta();
		$("#palvelualuevari").varivalinta();
		$("#vuorovari").varivalinta();

		//Alustaa lisäysvalinta ruudun
		$("#lisaysruutu").dialog({
			autoOpen: false,
			width: 550,
			title: "Lisää uusi...",
			buttons: [
				{
					class: "oikeapainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa käyttäjän muokkaus ruudun
		$("#kayttajaTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 500,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tallenna_kayttaja();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_kayttajaPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa käyttäjän poisto ruudun
		$("#kayttajaPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_kayttaja();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa sijaisen muokkaus ruudun
		$("#sijainenTietoRuutu").dialog({
			autoOpen: false,
			width: 700,
			height: 700,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tarkista_sijaisen_tila();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_sijainenPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa sijaisen tilan asetus ruudun
		$("#sijainenTilaRuutu").dialog({
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Aseta",
					click: function () {
						hallinta_tallenna_sijainen();
						$(this).dialog("close");
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa sijaisen poisto ruudun
		$("#sijainenPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_sijainen();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa reservilaisen muokkaus ruudun
		$("#reservilainenTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 500,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tarkista_reservilaisen_tila();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_reservilainenPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa reservilaisen tilan asetus ruudun
		$("#reservilainenTilaRuutu").dialog({
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Aseta",
					click: function () {
						hallinta_tallenna_reservilainen();
						$(this).dialog("close");
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa reservilaisen poisto ruudun
		$("#reservilainenPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_reservilainen();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa sihteerin muokkaus ruudun
		$("#sihteeriTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 500,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tarkista_sihteerin_tila();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_sihteeriPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa sihteerin tilan asetus ruudun
		$("#sihteeriTilaRuutu").dialog({
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Aseta",
					click: function () {
						hallinta_tallenna_sihteeri();
						$(this).dialog("close");
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa sihteerin poisto ruudun
		$("#sihteeriPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_sihteeri();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa nimikkeen muokkaus ruudun
		$("#nimikeTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 350,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tallenna_nimike();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_nimikePoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa nimikkeen poisto ruudun
		$("#nimikePoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_nimike();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa toimialueen muokkaus ruudun
		$("#toimialueTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 350,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tallenna_toimialue();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_toimialuePoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa toimialueen poisto ruudun
		$("#toimialuePoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_toimialue();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa palvelualueen muokkaus ruudun
		$("#palvelualueTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 350,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tallenna_palvelualue();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_palvelualuePoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa palvelualueen poisto ruudun
		$("#palvelualuePoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_palvelualue();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa osaston muokkaus ruudun
		$("#osastoTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 400,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tallenna_osasto();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_osastoPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa osaston poisto ruudun
		$("#osastoPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_osasto();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa työmäärän muokkaus ruudun
		$("#tyomaaraTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 350,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tallenna_tyomaara();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_tyomaaraPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa työmäärän poisto ruudun
		$("#tyomaaraPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_tyomaara();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa kustannuksen muokkaus ruudun
		$("#kustannusTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 350,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tallenna_kustannus();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_kustannusPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa kustannuksen poisto ruudun
		$("#kustannusPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_kustannus();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa henkilökustannuksen muokkaus ruudun
		$("#henkilokustannusTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 350,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tallenna_henkilokustannus();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_henkilokustannusPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa henkilokustannuksen poisto ruudun
		$("#henkilokustannusPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_henkilokustannus();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa kilometrikustannuksen muokkaus ruudun
		$("#kilometrikustannusTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 350,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tallenna_kilometrikustannus();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_kilometrikustannusPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa kilometrikustannuksen poisto ruudun
		$("#kilometrikustannusPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_kilometrikustannus();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa reservikustannuksen muokkaus ruudun
		$("#reservikustannusTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 350,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tallenna_reservikustannus();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_reservikustannusPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa reservikustannuksen poisto ruudun
		$("#reservikustannusPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_reservikustannus();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa reservihenkilokustannuksen muokkaus ruudun
		$("#reservihenkilokustannusTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 350,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tallenna_reservihenkilokustannus();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_reservihenkilokustannusPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa reservihenkilokustannuksen poisto ruudun
		$("#reservihenkilokustannusPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_reservihenkilokustannus();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa sihteerikustannuksen muokkaus ruudun
		$("#sihteerikustannusTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 350,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tallenna_sihteerikustannus();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_sihteerikustannusPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa sihteerikustannuksen poisto ruudun
		$("#sihteerikustannusPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_sihteerikustannus();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa kustannus ruudun alku pvm kentän
		$("#kustannusalkupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				$("#kustannusloppupvm").datepicker("option", "minDate", pvm);
			},
		});

		//Alustaa kustannus ruudun loppu pvm kentän
		$("#kustannusloppupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				$("#kustannusalkupvm").datepicker("option", "maxDate", pvm);
			},
		});

		//Alustaa henkilokustannus ruudun alku pvm kentän
		$("#henkilokustannusalkupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				$("#henkilokustannusloppupvm").datepicker("option", "minDate", pvm);
			},
		});

		//Alustaa henkilokustannus ruudun loppu pvm kentän
		$("#henkilokustannusloppupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				$("#henkilokustannusalkupvm").datepicker("option", "maxDate", pvm);
			},
		});

		//Alustaa kilometrikustannus ruudun alku pvm kentän
		$("#kilometrikustannusalkupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				$("#kilometrikustannusloppupvm").datepicker("option", "minDate", pvm);
			},
		});

		//Alustaa kilometrikustannus ruudun loppu pvm kentän
		$("#kilometrikustannusloppupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				$("#kilometrikustannusalkupvm").datepicker("option", "maxDate", pvm);
			},
		});

		//Alustaa reservikustannus ruudun alku pvm kentän
		$("#reservikustannusalkupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				$("#reservikustannusloppupvm").datepicker("option", "minDate", pvm);
			},
		});

		//Alustaa reservikustannus ruudun loppu pvm kentän
		$("#reservikustannusloppupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				$("#reservikustannusalkupvm").datepicker("option", "maxDate", pvm);
			},
		});

		//Alustaa reservihenkilokustannus ruudun alku pvm kentän
		$("#reservihenkilokustannusalkupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				$("#reservihenkilokustannusloppupvm").datepicker(
					"option",
					"minDate",
					pvm
				);
			},
		});

		//Alustaa reservihenkilokustannus ruudun loppu pvm kentän
		$("#reservihenkilokustannusloppupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				$("#reservihenkilokustannusalkupvm").datepicker(
					"option",
					"maxDate",
					pvm
				);
			},
		});

		//Alustaa sihteerikustannus ruudun alku pvm kentän
		$("#sihteerikustannusalkupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				$("#sihteerikustannusloppupvm").datepicker("option", "minDate", pvm);
			},
		});

		//Alustaa sihteerikustannus ruudun loppu pvm kentän
		$("#sihteerikustannusloppupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				$("#sihteerikustannusalkupvm").datepicker("option", "maxDate", pvm);
			},
		});

		//Alustaa sijaisuustaustan muokkaus ruudun
		$("#sijaisuustaustaTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 350,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tallenna_sijaisuustausta();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_sijaisuustaustaPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa sijaisuustaustan poisto ruudun
		$("#sijaisuustaustaPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_sijaisuustausta();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa reservitaustan muokkaus ruudun
		$("#reservitaustaTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 350,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tallenna_reservitausta();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_reservitaustaPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa reservitaustan poisto ruudun
		$("#reservitaustaPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_reservitausta();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa vuoron muokkaus ruudun
		$("#vuorotyyppiTietoRuutu").dialog({
			autoOpen: false,
			width: 550,
			height: 350,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						hallinta_tallenna_vuorotyyppi();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						hallinta_nayta_vuorotyyppiPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Alustaa vuoron poisto ruudun
		$("#vuorotyyppiPoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 550,
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						hallinta_poista_vuorotyyppi();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		//Asettaa numerokentät
		$(".vain_numero").keyup(function () {
			this.value = this.value.replace(/[^0-9\.]/g, "");
		});

		hallinta_alustettu = true;
	}

	//Asettaa käyttäjänäkymän
	$("#kayttajatnakyma").show();
	$("#sijaisetnakyma").hide();
	$("#reservilaisetnakyma").hide();
	$("#sihteeritnakyma").hide();
	$("#nimikkeetnakyma").hide();
	$("#toimialueetnakyma").hide();
	$("#palvelualueetnakyma").hide();
	$("#osastotnakyma").hide();
	$("#tyomaaratnakyma").hide();
	$("#kustannuksetnakyma").hide();
	$("#henkilokustannuksetnakyma").hide();
	$("#kilometrikustannuksetnakyma").hide();
	$("#reservikustannuksetnakyma").hide();
	$("#reservihenkilokustannuksetnakyma").hide();
	$("#sihteerikustannuksetnakyma").hide();
	$("#sijaisuustaustatnakyma").hide();
	$("#reservitaustatnakyma").hide();
	$("#vuorotyypitnakyma").hide();
	$("#sijaistentyyppisuodatin").val(-1);
	$("#reservilainentyyppisuodatin").val(-1);
	$("#sihteerityyppisuodatin").val(-1);
	$("#osastotyyppisuodatin").val(-1);
	$("#kustannuksetyyppisuodatin").val(-1);

	$("#hakukohde").prop("selectedIndex", 0);
	$("#hakukentta").val("");
	$("#tulosTeksti").html("Rivit yhteensä: 0");
	$(".reservitila").hide();
	$(".sihteeritila").hide();
	$(".sijaistila").show();
	$("#hallinta_tilakehys .painike_valittu_tila").removeClass(
		"painike_valittu_tila"
	);
	$("#hallinta_kustannustilakehys .painike_valittu_tila").removeClass(
		"painike_valittu_tila"
	);
	$("#osastokustannustilapainike").addClass("painike_valittu_tila");
	$("#sijaistilapainike").addClass("painike_valittu_tila");
	$("#reservitilapainike").hide();
	$("#sihteeritilapainike").hide();
	$("#hallinta_kustannustilakehys").hide();
	hallinta_tila = "sijaistila";

	if (reservihallinta) {
		$("#reservitilapainike").show();
	}

	if (sihteerihallinta) {
		$("#sihteeritilapainike").show();
	}

	hallinta_hae_toimialuevalinnat();
	hallinta_hae_palvelualuevalinnat();
	hallinta_hae_osasto_valinnat();
	hallinta_hae_nimike_valinnat();
	hallinta_hae_osasto_toimialue_valinnat();
	hallinta_hae_sijaisuustausta_valinnat();
	hallinta_hae_nakymat();
	hallinta_hae_kayttajat();
	hallinta_hae_sijainen_valinnat();
	hallinta_hae_reservilainen_valinnat();
	hallinta_nayta_sisalto("kayttajat", false);
}

function hallinta_hae_tiedot() {
	let valinta = $("#hakukohde option:selected").val();
	hallinta_haku = true;
	hallinta_nayta_sisalto(valinta, true);
}

function hallinta_nayta_sisalto(sisalto, paivita) {
	$("#tulosTeksti").html("Rivit yhteensä: 0");
	$("#hakukohde").val(sisalto);
	$("#hallinta_sijaisetsuodatin").hide();
	$("#hallinta_kustannustilakehys").hide();
	$("#hallinta_reservilaisetsuodatin").hide();
	$("#hallinta_sihteeritsuodatin").hide();
	$("#hallinta_osastotsuodatin").hide();
	$("#hallinta_kustannuksetsuodatin").hide();
	$("#kayttajatlehtipainike").removeClass("navpainike_selected");
	$("#sijaisetlehtipainike").removeClass("navpainike_selected");
	$("#reservilaisetlehtipainike").removeClass("navpainike_selected");
	$("#sihteeritlehtipainike").removeClass("navpainike_selected");
	$("#nimikkeetlehtipainike").removeClass("navpainike_selected");
	$("#toimialueetlehtipainike").removeClass("navpainike_selected");
	$("#palvelualueetlehtipainike").removeClass("navpainike_selected");
	$("#osastotlehtipainike").removeClass("navpainike_selected");
	$("#tyomaaratlehtipainike").removeClass("navpainike_selected");
	$("#kustannuksetlehtipainike").removeClass("navpainike_selected");
	$("#reservikustannuksetlehtipainike").removeClass("navpainike_selected");
	$("#sihteerikustannuksetlehtipainike").removeClass("navpainike_selected");
	$("#sijaisuustaustatlehtipainike").removeClass("navpainike_selected");
	$("#reservitaustatlehtipainike").removeClass("navpainike_selected");
	$("#vuorotyypitlehtipainike").removeClass("navpainike_selected");

	$("#kayttajatnakyma").hide();
	$("#sijaisetnakyma").hide();
	$("#reservilaisetnakyma").hide();
	$("#sihteeritnakyma").hide();
	$("#nimikkeetnakyma").hide();
	$("#toimialueetnakyma").hide();
	$("#palvelualueetnakyma").hide();
	$("#osastotnakyma").hide();
	$("#tyomaaratnakyma").hide();
	$("#kustannuksetnakyma").hide();
	$("#henkilokustannuksetnakyma").hide();
	$("#kilometrikustannuksetnakyma").hide();
	$("#reservikustannuksetnakyma").hide();
	$("#reservihenkilokustannuksetnakyma").hide();
	$("#sihteerikustannuksetnakyma").hide();
	$("#sijaisuustaustatnakyma").hide();
	$("#reservitaustatnakyma").hide();
	$("#vuorotyypitnakyma").hide();

	if (!hallinta_haku) {
		$("#hakukentta").val("");
	}

	switch (sisalto) {
		case "kayttajat":
			$("#kayttajatlehtipainike").addClass("navpainike_selected");
			$("#kayttajatnakyma").show();
			if (paivita) {
				hallinta_hae_kayttajat();
			}
			break;

		case "sijaiset":
			$("#sijaisetlehtipainike").addClass("navpainike_selected");
			$("#sijaisetnakyma").show();
			$("#hallinta_sijaisetsuodatin").show();
			if (paivita) {
				hallinta_hae_sijaiset();
			}
			break;

		case "reservilaiset":
			$("#reservilaisetlehtipainike").addClass("navpainike_selected");
			$("#reservilaisetnakyma").show();
			$("#hallinta_reservilaisetsuodatin").show();
			if (paivita) {
				hallinta_hae_reservilaiset();
			}
			break;

		case "sihteerit":
			$("#sihteeritlehtipainike").addClass("navpainike_selected");
			$("#sihteeritnakyma").show();
			$("#hallinta_sihteeritsuodatin").show();
			if (paivita) {
				hallinta_hae_sihteerit();
			}
			break;

		case "nimikkeet":
			$("#nimikkeetlehtipainike").addClass("navpainike_selected");
			$("#nimikkeetnakyma").show();
			if (paivita) {
				hallinta_hae_nimikkeet();
			}
			break;

		case "toimialueet":
			$("#toimialueetlehtipainike").addClass("navpainike_selected");
			$("#toimialueetnakyma").show();
			if (paivita) {
				hallinta_hae_toimialueet();
			}
			break;

		case "palvelualueet":
			$("#palvelualueetlehtipainike").addClass("navpainike_selected");
			$("#palvelualueetnakyma").show();
			if (paivita) {
				hallinta_hae_palvelualueet();
			}
			break;

		case "osastot":
			$("#osastotlehtipainike").addClass("navpainike_selected");
			$("#osastotnakyma").show();
			$("#hallinta_osastotsuodatin").show();
			if (paivita) {
				hallinta_hae_osastot();
			}
			break;

		case "tyomaarat":
			$("#tyomaaratlehtipainike").addClass("navpainike_selected");
			$("#tyomaaratnakyma").show();
			if (paivita) {
				hallinta_hae_tyomaarat();
			}
			break;

		case "kustannukset":
			$("#kustannuksetlehtipainike").addClass("navpainike_selected");
			$("#kustannuksetnakyma").show();
			$("#hallinta_kustannustilakehys").show();
			$("#henkilokustannustilapainike").hide();
			$("#kilometrikustannustilapainike").show();
			$("#hallinta_kustannustilakehys .painike_valittu_tila").removeClass(
				"painike_valittu_tila"
			);
			$("#osastokustannustilapainike").addClass("painike_valittu_tila");
			$("#hallinta_kustannuksetsuodatin").show();
			if (paivita) {
				hallinta_hae_kustannukset();
			}
			break;
		/*
		case "henkilokustannukset":
			$('#kustannuksetlehtipainike').addClass('navpainike_selected');
			$('#henkilokustannuksetnakyma').show();
			$('#hallinta_kustannustilakehys').show();
			$('#hallinta_kustannustilakehys .painike_valittu_tila').removeClass("painike_valittu_tila");
      $('#henkilokustannustilapainike').addClass("painike_valittu_tila");
      $("#hallinta_kustannuksetsuodatin").hide();
			if(paivita) {
				hallinta_hae_henkilokustannukset();
			}
		break;
    */

		case "kilometrikustannukset":
			$("#kustannuksetlehtipainike").addClass("navpainike_selected");
			$("#kilometrikustannuksetnakyma").show();
			$("#hallinta_kustannustilakehys").show();
			$("#henkilokustannustilapainike").hide();
			$("#kilometrikustannustilapainike").show();
			$("#hallinta_kustannustilakehys .painike_valittu_tila").removeClass(
				"painike_valittu_tila"
			);
			$("#kilometrikustannustilapainike").addClass("painike_valittu_tila");
			$("#hallinta_kustannuksetsuodatin").hide();
			if (paivita) {
				hallinta_hae_kilometrikustannukset();
			}
			break;

		case "reservikustannukset":
			$("#reservikustannuksetlehtipainike").addClass("navpainike_selected");
			$("#reservikustannuksetnakyma").show();
			$("#hallinta_kustannustilakehys").show();
			$("#henkilokustannustilapainike").show();
			$("#kilometrikustannustilapainike").hide();
			$("#hallinta_kustannustilakehys .painike_valittu_tila").removeClass(
				"painike_valittu_tila"
			);
			$("#osastokustannustilapainike").addClass("painike_valittu_tila");
			if (paivita) {
				hallinta_hae_reservikustannukset();
			}
			break;

		case "reservihenkilokustannukset":
			$("#reservikustannuksetlehtipainike").addClass("navpainike_selected");
			$("#reservihenkilokustannuksetnakyma").show();
			$("#hallinta_kustannustilakehys").show();
			$("#henkilokustannustilapainike").show();
			$("#kilometrikustannustilapainike").hide();
			$("#hallinta_kustannustilakehys .painike_valittu_tila").removeClass(
				"painike_valittu_tila"
			);
			$("#henkilokustannustilapainike").addClass("painike_valittu_tila");
			if (paivita) {
				hallinta_hae_reservihenkilokustannukset();
			}
			break;

		case "sihteerikustannukset":
			$("#sihteerikustannuksetlehtipainike").addClass("navpainike_selected");
			$("#sihteerikustannuksetnakyma").show();
			if (paivita) {
				hallinta_hae_sihteerikustannukset();
			}
			break;

		case "sijaisuustaustat":
			$("#sijaisuustaustatlehtipainike").addClass("navpainike_selected");
			$("#sijaisuustaustatnakyma").show();
			if (paivita) {
				hallinta_hae_sijaisuustaustat();
			}
			break;

		case "reservitaustat":
			$("#reservitaustatlehtipainike").addClass("navpainike_selected");
			$("#reservitaustatnakyma").show();
			if (paivita) {
				hallinta_hae_reservitaustat();
			}
			break;

		case "vuorotyypit":
			$("#vuorotyypitlehtipainike").addClass("navpainike_selected");
			$("#vuorotyypitnakyma").show();
			if (paivita) {
				hallinta_hae_vuorotyypit();
			}
			break;

		default:
	}
	hallinta_haku = false;
}

function hallinta_nayta_lisaysruutu() {
	$("#lisaysruutu").dialog("open");
}

function hallinta_nayta_valittu_lisaysruutu(valinta) {
	hallinta_nayta_sisalto(valinta, true);
	switch (valinta) {
		case "kayttajat":
			hallinta_nayta_kayttajaTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "sijaiset":
			hallinta_nayta_sijainenTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "reservilaiset":
			hallinta_nayta_reservilainenTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "sihteerit":
			hallinta_nayta_sihteeriTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "nimikkeet":
			hallinta_nayta_nimikeTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "toimialueet":
			hallinta_nayta_toimialueTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "palvelualueet":
			hallinta_nayta_palvelualueTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "osastot":
			hallinta_nayta_osastoTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "tyomaarat":
			hallinta_nayta_tyomaaraTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "kustannukset":
			hallinta_nayta_kustannusTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "henkilokustannukset":
			hallinta_nayta_henkilokustannusTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "kilometrikustannukset":
			hallinta_nayta_kilometrikustannusTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "reservikustannukset":
			hallinta_nayta_reservikustannusTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "reservihenkilokustannukset":
			hallinta_nayta_reservihenkilokustannusTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "sihteerikustannukset":
			hallinta_nayta_sihteerikustannusTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "sijaisuustaustat":
			hallinta_nayta_sijaisuustaustaTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "reservitaustat":
			hallinta_nayta_reservitaustaTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;

		case "vuorotyypit":
			hallinta_nayta_vuoroTietoRuutu("");
			$("#lisaysruutu").dialog("close");
			break;
	}
}

function hallinta_hae_nakymat() {
	$("#kayttajanakymat").html("");

	$.post("php/hae_nakyma_valinnat.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			for (let i = 0; i < replyObj.length; i++) {
				$("#kayttajanakymat").append(
					"<div class='valinta_rivi'>" +
						"<input type='checkbox' value='" +
						replyObj[i].id +
						"' />" +
						"<span class='valinta_rivi_teksti'>" +
						replyObj[i].nimi +
						"</span>" +
						"</div>"
				);
			}
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_hae_sijaisuustausta_valinnat() {
	$("#kayttajasijaisuustaustat").html("");

	$.post("php/hae_sijaisuustausta_valinnat.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			for (let i = 0; i < replyObj.length; i++) {
				$("#kayttajasijaisuustaustat").append(
					"<div class='valinta_rivi'>" +
						"<input type='checkbox' value='" +
						replyObj[i].id +
						"' />" +
						"<span class='valinta_rivi_teksti'>" +
						replyObj[i].numero +
						" = " +
						replyObj[i].selite +
						"</span>" +
						"</div>"
				);
			}
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_aseta_kayttaja_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == kayttaja_jarjestysarvo) {
		if (kayttaja_jarjestys == "DESC") {
			kayttaja_jarjestys = "ASC";
		} else {
			kayttaja_jarjestys = "DESC";
		}
	} else {
		kayttaja_jarjestysarvo = jarjestysarvo;
		kayttaja_jarjestys = "ASC";
	}

	hallinta_hae_kayttajat();
}

function hallinta_hae_kayttajat() {
	let haku_sana = "";

	if ($("#hakukohde option:selected").val() == "kayttajat") {
		haku_sana = $("#hakukentta").val();
	}

	$.post(
		"php/hae_kayttajat.php",
		{
			hakusana: haku_sana,
			jarjestys: kayttaja_jarjestys,
			jarjestettavaarvo: kayttaja_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "[]":
						$("#kayttajadata").html("");
						$("#kayttajadata").append(
							"<tr>" +
								"<td colspan='3'><span>Käyttäjiä ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					case "parametri":
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#kayttajadata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let virhe = false;
							let id = replyObj[i].id;
							let rivitila = "";
							if (replyObj[i].toimialueet == null) {
								rivitila = "class='tarkista_rivi'";
								virhe = true;
							}

							let kayttajadata =
								"<tr id='kayttaja_rivi_" +
								id +
								"'" +
								rivitila +
								">" +
								"<td><span id='kayttaja_tunnus_" +
								id +
								"'>" +
								replyObj[i].tunnus +
								"</span></td>" +
								"<td><span id='kayttaja_nakymat_" +
								id +
								"'>" +
								replyObj[i].nakymat +
								"</span></td>" +
								"<td><span id='kayttaja_nakymat_" +
								id +
								"'>" +
								replyObj[i].sijaisuustaustat +
								"</span></td>" +
								"<td><span id='kayttaja_toimialue_" +
								id +
								"'>" +
								replyObj[i].toimialueet +
								"</span></td>" +
								"</tr>";

							if (virhe) {
								$("#kayttajadata").prepend(kayttajadata);
							} else {
								$("#kayttajadata").append(kayttajadata);
							}

							$("#kayttaja_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_kayttajaTietoRuutu(
									$(this).prop("id").replace("kayttaja_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_nayta_kayttajaTietoRuutu(id) {
	$("#kayttajaTietoRuutu")
		.next(".ui-dialog-buttonpane")
		.find("button:contains('Poista')")
		.hide();
	$("#kayttajaid").html("");
	$("#kayttajatunnus").val("");
	$("#kayttajasalasana").val("");
	$("#salasanatarkistus").val("");
	$("#kayttajaoikeudet_0").prop("checked", true);
	$("#kayttajatoimialueet")
		.find("input[type=checkbox]:checked")
		.prop("checked", false);
	$("#kayttajatoimialueet").scrollTop(0);
	$("#kayttajanakymat")
		.find("input[type=checkbox]:checked")
		.prop("checked", false);
	$("#kayttajanakymat").scrollTop(0);
	$("#kayttajasijaisuustaustat")
		.find("input[type=checkbox]:checked")
		.prop("checked", false);
	$("#kayttajasijaisuustaustat").scrollTop(0);
	$("#kayttajaTietoRuutu").dialog("option", "title", "Lisää käyttäjä");

	if (id != "") {
		$("#kayttajaTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa käyttäjän tietoja"
		);
		$("#kayttajaTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#kayttajaid").html(id);

		$.post(
			"php/hae_kayttajan_tiedot.php",
			{ kayttaja_id: id },
			function (reply) {
				if (reply.indexOf("Tietokantavirhe:") != -1) {
					alert("Tietokantavirhe");
				} else {
					switch (reply) {
						case "[]":
							alert("Käyttäjän tietoja ei löytynyt");
							break;

						case "parametri":
							alert("Parametrivirhe");
							break;

						default:
							let replyObj = JSON.parse(reply);
							$("#kayttajatunnus").val(replyObj[0].tunnus);

							if (replyObj[0].nakyma_idt != null) {
								let nakyma_idt = replyObj[0].nakyma_idt.split(",");
								$.each(nakyma_idt, function (i, val) {
									$("#kayttajanakymat input[value='" + val + "']").prop(
										"checked",
										true
									);
								});
							}

							if (replyObj[0].sijaisuustausta_idt != null) {
								let sijaisuustausta_idt =
									replyObj[0].sijaisuustausta_idt.split(",");
								$.each(sijaisuustausta_idt, function (i, val) {
									$(
										"#kayttajasijaisuustaustat input[value='" + val + "']"
									).prop("checked", true);
								});
							}

							if (replyObj[0].toimialue_idt != null) {
								let toimialue_idt = replyObj[0].toimialue_idt.split(",");
								$.each(toimialue_idt, function (i, val) {
									$("#kayttajatoimialueet input[value='" + val + "']").prop(
										"checked",
										true
									);
								});
							}
							$("#kayttajaTietoRuutu").dialog("open");
					}
				}
			}
		);
	} else {
		$("#kayttajaTietoRuutu").dialog("open");
	}
}

function hallinta_tallenna_kayttaja() {
	let k_id = $("#kayttajaid").html();
	let k_tunnus = $("#kayttajatunnus").val();
	let k_salasana = $("#kayttajasalasana").val();
	let tarkistus_salasana = $("#salasanatarkistus").val();

	let k_oikeudet = 0;
	if ($("#kayttajaoikeudet_1").prop("checked")) {
		k_oikeudet = 1;
	} else if ($("#kayttajaoikeudet_2").prop("checked")) {
		k_oikeudet = 2;
	}

	let k_toimialueet = "";
	$("#kayttajatoimialueet input:checked").each(function () {
		k_toimialueet += "," + this.value;
	});

	if (k_toimialueet.length > 0) {
		k_toimialueet = k_toimialueet.substr(1);
	}

	let k_nakymat = "";
	$("#kayttajanakymat input:checked").each(function () {
		k_nakymat += "," + this.value;
	});

	if (k_nakymat.length > 0) {
		k_nakymat = k_nakymat.substr(1);
	}

	let k_sijaisuustaustat = "";
	$("#kayttajasijaisuustaustat input:checked").each(function () {
		k_sijaisuustaustat += "," + this.value;
	});

	if (k_sijaisuustaustat.length > 0) {
		k_sijaisuustaustat = k_sijaisuustaustat.substr(1);
	}

	if (k_tunnus == "") {
		alert("Tarkista tiedot");
		return;
	}

	if (k_id == "") {
		if (k_salasana == "" || k_salasana != tarkistus_salasana) {
			alert("Tarkista tiedot");
			return;
		}
	}

	if (k_toimialueet == "" || k_nakymat == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_kayttaja.php",
		{
			id: k_id,
			tunnus: k_tunnus,
			salasana: k_salasana,
			nakymat: k_nakymat,
			sijaisuustaustat: k_sijaisuustaustat,
			toimialueet: k_toimialueet,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Tunnus on jo olemassa");
						break;

					default:
						nayta_tilaviesti("Käyttäjän lisäys/päivitys onnistui");
						hallinta_hae_kayttajat();
						hallinta_nayta_sisalto("kayttajat", false);
						if (k_id == "") {
							$("#kayttajatunnus").val("");
							$("#kayttajasalasana").val("");
							$("#salasanatarkistus").val("");
							$("#kayttajaoikeudet_0").prop("checked", true);
							$("#kayttajanakymat")
								.find("input[type=checkbox]:checked")
								.prop("checked", false);
							$("#kayttajanakymat").scrollTop(0);
							$("#kayttajasijaisuustaustat")
								.find("input[type=checkbox]:checked")
								.prop("checked", false);
							$("#kayttajasijaisuustaustat").scrollTop(0);
							$("#kayttajatoimialueet")
								.find("input[type=checkbox]:checked")
								.prop("checked", false);
							$("#kayttajatoimialueet").scrollTop(0);
						} else {
							if (k_id == kirjautunut_kayttaja_id) {
								alert(
									"Muutokset astuvat voimaan kirjautuessasi seuraavaan kerran sisään"
								);
							}
							$("#kayttajaTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_kayttajaPoistoRuutu() {
	let id = $("#kayttajaid").html();
	$("#kayttajapoistoid").html(id);
	let teksti =
		"Haluatko poistaa käyttäjän " + $("#kayttaja_tunnus_" + id).html() + "?";
	$("#kayttajaPoistoRuutu").dialog("option", "title", teksti);
	$("#kayttajaPoistoRuutu").dialog("open");
}

function hallinta_poista_kayttaja() {
	let k_id = $("#kayttajapoistoid").html();

	if (k_id == "") {
		alert("Id virhe");
		return;
	}

	$.post("php/poista_kayttaja.php", { id: k_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			nayta_tilaviesti("Käyttäjän poisto onnistui");
			$("#kayttajapoistoid").html("");
			hallinta_hae_kayttajat();
			hallinta_nayta_sisalto("kayttajat", false);
			$("#kayttajaTietoRuutu").dialog("close");
			$("#kayttajaPoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_piilotaOsasto() {
	if ($("#sijainenkotiosasto option:selected").val() == 0) {
		$("#sijainenmuutosastot input").prop("disabled", false);
		$("#sijainenmahdosastot input").prop("disabled", false);
	} else {
		$("#sijainenmuutosastot input").prop("disabled", false);
		$(
			"#sijainenmuutosastot input[value='" +
				$("#sijainenkotiosasto option:selected").val() +
				"']"
		).prop("disabled", true);
		$(
			"#sijainenmuutosastot input[value='" +
				$("#sijainenkotiosasto option:selected").val() +
				"']"
		).prop("checked", false);
		$("#sijainenmahdosastot input").prop("disabled", false);
		$(
			"#sijainenmahdosastot input[value='" +
				$("#sijainenkotiosasto option:selected").val() +
				"']"
		).prop("disabled", true);
		$(
			"#sijainenmahdosastot input[value='" +
				$("#sijainenkotiosasto option:selected").val() +
				"']"
		).prop("checked", false);
	}
}

function hallinta_aseta_sijainen_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == sijainen_jarjestysarvo) {
		if (sijainen_jarjestys == "DESC") {
			sijainen_jarjestys = "ASC";
		} else {
			sijainen_jarjestys = "DESC";
		}
	} else {
		sijainen_jarjestysarvo = jarjestysarvo;
		sijainen_jarjestys = "ASC";
	}

	hallinta_hae_sijaiset();
}

function hallinta_hae_sijaiset() {
	let suodatin_sijaistentyyppi = -1;
	let suodatin_toimialue = -1;
	let suodatin_osasto = -1;
	let suodatin_nimike = -1;
	let haku_sana = "";

	if ($("#hakukohde option:selected").val() == "sijaiset") {
		haku_sana = $("#hakukentta").val();
	}

	if ($("#sijaistentyyppisuodatin").val() != -1) {
		suodatin_sijaistentyyppi = $("#sijaistentyyppisuodatin").val();
	}

	if ($("#toimialuesuodatin").val() != 0) {
		suodatin_toimialue = $("#toimialuesuodatin").val();
	}

	if ($("#osastosuodatin").val() != 0) {
		suodatin_osasto = $("#osastosuodatin").val();
	}

	if ($("#nimikesuodatin").val() != 0) {
		suodatin_nimike = $("#nimikesuodatin").val();
	}

	$.post(
		"php/hae_sijaiset.php",
		{
			sijaistentyyppi: suodatin_sijaistentyyppi,
			toimialue_id: suodatin_toimialue,
			nimike_id: suodatin_nimike,
			osasto_id: suodatin_osasto,
			hakunimi: haku_sana,
			jarjestys: sijainen_jarjestys,
			jarjestettavaarvo: sijainen_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "[]":
						$("#sijainendata").html("");
						$("#sijainendata").append(
							"<tr>" +
								"<td colspan='10'><span>Sissejä ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					case "parametri":
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#sijainendata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let virhe = false;
							let id = replyObj[i].id;
							let sms = "Ei";
							let tila = "";
							if (replyObj[i].sms == 1) {
								sms = "Kyllä";
							}

							let kotiosasto = replyObj[i].kotiosasto;
							if (kotiosasto == null) {
								kotiosasto = "";
							}

							let muut_osastot_data = replyObj[i].muut_osastot;
							if (muut_osastot_data == null) {
								muut_osastot_data = "";
							}

							let mahd_osastot_data = replyObj[i].mahd_osastot;
							if (mahd_osastot_data == null) {
								mahd_osastot_data = "";
							}

							let aktiivinen_sijainen = "";
							if (replyObj[i].aktiivinen == 0) {
								aktiivinen_sijainen = " class='ei_aktiivinen'";
								tila = " (!) ";
							}

							let nimi = replyObj[i].nimi;
							let laakelupa = "Lääkl-";
							if (replyObj[i].laakelupa == 1) {
								laakelupa = "Lääkl+";
							}

							let rivitila = "";
							if (
								replyObj[i].toimialueet == null ||
								replyObj[i].kotiosasto == null ||
								replyObj[i].nimike == null
							) {
								rivitila = "class='tarkista_rivi'";
								virhe = true;
							}

							let sijainendata =
								"<tr id='sijainen_rivi_" +
								id +
								"'" +
								aktiivinen_sijainen +
								rivitila +
								">" +
								"<td><span id='sijainen_nimi_" +
								id +
								"'>" +
								tila +
								nimi +
								"</span></td>" +
								"<td><span id='sijainen_nimike_" +
								id +
								"'>" +
								replyObj[i].nimike +
								"</span></td>" +
								"<td><span id='sijainen_kotiosasto_" +
								id +
								"'>" +
								kotiosasto +
								"</span></td>" +
								"<td><span id='sijainen_muut_osastot_" +
								id +
								"'>" +
								muut_osastot_data +
								"</span></td>" +
								"<td><span id='sijainen_mahd_osastot_" +
								id +
								"'>" +
								mahd_osastot_data +
								"</span></td>" +
								"<td><span id='sijainen_kommentti_" +
								id +
								"'>" +
								replyObj[i].kommentti +
								"</span></td>" +
								"<td><span id='sijainen_iv_" +
								id +
								"'>" +
								replyObj[i].iv +
								"</span></td>" +
								"<td><span id='sijainen_laakelupa_" +
								id +
								"'>" +
								laakelupa +
								"</span></td>" +
								"<td><span id='sijainen_puhelin_" +
								id +
								"'>" +
								replyObj[i].puhelin +
								"</span></td>" +
								"<td><span id='sijainen_sms_" +
								id +
								"'>" +
								sms +
								"</span></td>" +
								"<td><span id='sijainen_toimialue_" +
								id +
								"'>" +
								replyObj[i].toimialueet +
								"</span></td>" +
								"</tr>";

							if (virhe) {
								$("#sijainendata").prepend(sijainendata);
							} else {
								$("#sijainendata").append(sijainendata);
							}

							$("#sijainen_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_sijainenTietoRuutu(
									$(this).prop("id").replace("sijainen_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_hae_osasto_toimialue_valinnat() {
	$("#sijainenkotiosasto").html("<option value='0'>Valitse</option>");
	$("#sijainenmuutosastot").html("");
	$("#sijainenmahdosastot").html("");

	$.post(
		"php/hae_osasto_valinnat.php",
		{ jarjestys: "toimialue-nimi" },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				let nykyinen_toimialue = "";
				for (let i = 0; i < replyObj.length; i++) {
					if (replyObj[i].toimialue_id != 0) {
						if (nykyinen_toimialue != replyObj[i].toimialue_nimi) {
							$("#sijainenmuutosastot").append(
								"<span id='sijainenmuutosastot_toimialue_otsikko_" +
									replyObj[i].toimialue_id +
									"' class='sijainenmuutosastot_toimialue_otsikko'>" +
									replyObj[i].toimialue_nimi +
									"</span>"
							);
							$("#sijainenmahdosastot").append(
								"<span id='sijainenmahdosastot_toimialue_otsikko_" +
									replyObj[i].toimialue_id +
									"' class='sijainenmahdosastot_toimialue_otsikko'>" +
									replyObj[i].toimialue_nimi +
									"</span>"
							);
							nykyinen_toimialue = replyObj[i].toimialue_nimi;
						}

						$("#sijainenkotiosasto").append(
							"<option id='kotiosastovalinta_" +
								replyObj[i].id +
								"' value='" +
								replyObj[i].id +
								"' style='background-color:" +
								replyObj[i].taustavari +
								"' class='sijainenkotiosasto_valinta sijainen_kotiosasto_toimialue_" +
								replyObj[i].toimialue_id +
								"'>" +
								replyObj[i].nimi +
								"</option>"
						);
						$("#sijainenmuutosastot").append(
							"<div style='background-color:" +
								replyObj[i].taustavari +
								"' class='sijainenmuutosasto_valinta sijainen_muuosasto_toimialue_" +
								replyObj[i].toimialue_id +
								"''>" +
								"<input id='muutosastovalinta_" +
								replyObj[i].id +
								"' type='checkbox' value='" +
								replyObj[i].id +
								"' />" +
								"<span>" +
								replyObj[i].nimi +
								"</span>" +
								"</div>"
						);

						$("#sijainenmahdosastot").append(
							"<div style='background-color:" +
								replyObj[i].taustavari +
								"' class='sijainenmahdosasto_valinta sijainen_mahdosasto_toimialue_" +
								replyObj[i].toimialue_id +
								"''>" +
								"<input id='mahdosastovalinta_" +
								replyObj[i].id +
								"' type='checkbox' value='" +
								replyObj[i].id +
								"' />" +
								"<span>" +
								replyObj[i].nimi +
								"</span>" +
								"</div>"
						);
					}
				}

				$("#sijainenmuutosastot input").each(function () {
					$(this).click(function () {
						let id = $(this).prop("id").replace("muutosastovalinta_", "");

						if ($(this).prop("checked")) {
							$("#sijainenmahdosastot input[value='" + id + "']").prop(
								"disabled",
								true
							);
							$("#sijainenmahdosastot input[value='" + id + "']").prop(
								"checked",
								false
							);
						} else {
							$("#sijainenmahdosastot input[value='" + id + "']").prop(
								"disabled",
								false
							);
						}
					});
				});

				$("#sijainenmahdosastot input").each(function () {
					$(this).click(function () {
						let id = $(this).prop("id").replace("mahdosastovalinta_", "");

						if ($(this).prop("checked")) {
							$("#sijainenmuutosastot input[value='" + id + "']").prop(
								"disabled",
								true
							);
							$("#sijainenmuutosastot input[value='" + id + "']").prop(
								"checked",
								false
							);
						} else {
							$("#sijainenmuutosastot input[value='" + id + "']").prop(
								"disabled",
								false
							);
						}
					});
				});
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function hallinta_hae_sijainen_valinnat() {
	$("#henkilokustannussijainen").html("<option value='-1'>Valitse</option>");
	$("#henkilokustannussijainen").val(-1);

	$.post("php/hae_sijainen_valinnat.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			if (replyObj.length > 0) {
				for (let i = 0; i < replyObj.length; i++) {
					$("#henkilokustannussijainen").append(
						"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].nimi +
							"</option>"
					);
				}
			}
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_nayta_sijainenTietoRuutu(s_id) {
	$("#sijainenTietoRuutu")
		.next(".ui-dialog-buttonpane")
		.find("button:contains('Poista')")
		.hide();
	$("#sijainenid").html(s_id);
	$("#sijainennimi").val("");
	$("#sijainennimike").prop("selectedIndex", 0);
	$("#sijainenkotiosasto").prop("selectedIndex", 0);
	$("#sijainenmuutosastot")
		.find("input[type=checkbox]:checked")
		.prop("checked", false);
	$("#sijainenmuutosastot").scrollTop(0);
	$("#sijainenmahdosastot")
		.find("input[type=checkbox]:checked")
		.prop("checked", false);
	$("#sijainenmahdosastot").scrollTop(0);
	$(".radiopainike input").prop("checked", false);
	$("#sijainenlaakelupa_valinta").prop("checked", false);
	$("#sijainenkommentti").val("");
	$("#sijainentoimialueet")
		.find("input[type=checkbox]:checked")
		.prop("checked", false);
	$("#sijainentoimialueet").scrollTop(0);
	$("#sijainenaktiivinenvalintaKehys").hide();
	$("#sijainenaktiivinen_valinta").prop("checked", true);
	$("#sijainenpuhnro").val("");
	$("#sijainensms_valinta").prop("checked", false);
	$("#sijainenTietoRuutu").dialog("option", "title", "Lisää sissi");
	$(".sijainenkotiosasto_valinta").addClass("piilotettu");
	$(".sijainenmuutosasto_valinta").addClass("piilotettu");
	$(".sijainenmahdosasto_valinta").addClass("piilotettu");
	$(".sijainenmuutosastot_toimialue_otsikko").addClass("piilotettu");
	$(".sijainenmahdosastot_toimialue_otsikko").addClass("piilotettu");
	$("#sijainenpaatoimialue").html("");
	$("#sijainenpin").html("xxxx");
	$("#sijainenpin").removeClass("sijainenpin_muokattu");

	if (s_id != "") {
		$("#sijainenaktiivinenvalintaKehys").show();
		$("#sijainenTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa sissin tietoja"
		);
		$("#sijainenTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#sijainen_id").html(s_id);

		$.post("php/hae_sijaisen_tiedot.php", { id: s_id }, function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "[]":
						alert("Sissin tietoja ei löytynyt");
						break;

					case "parametri":
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#sijainennimi").val(replyObj[0].nimi);
						$("#sijainennimike").val(replyObj[0].nimike_id);

						let iv = replyObj[0].iv;
						if (iv == "-") {
							$("#sijainen_iv_valinta_0").prop("checked", true);
						} else if (iv == "IV+") {
							$("#sijainen_iv_valinta_1").prop("checked", true);
						} else if (iv == "IV-") {
							$("#sijainen_iv_valinta_2").prop("checked", true);
						} else if (iv == "NHT") {
							$("#sijainen_iv_valinta_3").prop("checked", true);
						}
						let laakelupa = replyObj[0].laakelupa;
						if (laakelupa == "0") {
							$("#sijainen_laakelupa_valinta_0").prop("checked", true);
						} else {
							$("#sijainen_laakelupa_valinta_1").prop("checked", true);
						}

						$("#sijainenkommentti").val(replyObj[0].kommentti);

						if (replyObj[0].toimialue_idt != null) {
							let toimialue_idt = replyObj[0].toimialue_idt.split(",");
							$.each(toimialue_idt, function (i, val) {
								$("#sijainentoimialueet input[value='" + val + "']").prop(
									"checked",
									true
								);
								$(".sijainen_kotiosasto_toimialue_" + val).removeClass(
									"piilotettu"
								);
								$(".sijainen_muuosasto_toimialue_" + val).removeClass(
									"piilotettu"
								);
								$(".sijainen_mahdosasto_toimialue_" + val).removeClass(
									"piilotettu"
								);
								$("#sijainenmuutosastot_toimialue_otsikko_" + val).removeClass(
									"piilotettu"
								);
								$("#sijainenmahdosastot_toimialue_otsikko_" + val).removeClass(
									"piilotettu"
								);
							});
						}

						if (replyObj[0].aktiivinen == 0) {
							$("#sijainenaktiivinen_valinta").prop("checked", false);
						}

						$("#sijainenpuhnro").val(replyObj[0].puhelin);

						if (replyObj[0].kiinnitys_sms == 1) {
							$("#sijainensms_valinta").prop("checked", true);
						}

						$("#sijainenkotiosasto").val(replyObj[0].kotiosasto_id).change();
						$("#sijainenpaatoimialue").html(replyObj[0].toimialue_nimi);
						if (
							replyObj[0].muut_osasto_idt != null ||
							replyObj[0].muut_osasto_idt != ""
						) {
							let osasto_idt = replyObj[0].muut_osasto_idt.split(",");
							for (let i = 0; i < osasto_idt.length; i++) {
								$(
									"#sijainenmuutosastot input[value='" + osasto_idt[i] + "']"
								).prop("checked", true);
								$(
									"#sijainenmahdosastot input[value='" + osasto_idt[i] + "']"
								).prop("disabled", true);
							}
						}

						if (
							replyObj[0].mahd_osasto_idt != null ||
							replyObj[0].mahd_osasto_idt != ""
						) {
							let osasto_idt = replyObj[0].mahd_osasto_idt.split(",");
							for (let i = 0; i < osasto_idt.length; i++) {
								$(
									"#sijainenmahdosastot input[value='" + osasto_idt[i] + "']"
								).prop("checked", true);
								$(
									"#sijainenmuutosastot input[value='" + osasto_idt[i] + "']"
								).prop("disabled", true);
							}
						}

						replyObj[0].pin == null
							? $("#sijainenpin").html("xxxx")
							: $("#sijainenpin").html(replyObj[0].pin);
						$("#sijainenpaikallaviimeksi").html(replyObj[0].aikaleima);
						$("#sijainenTietoRuutu").dialog("open");
				}
			}
		});
	} else {
		$("#sijainenTietoRuutu").dialog("open");
	}
}

function hallinta_generoi_sijaiselle_pin() {
	let si_id = $("#sijainenid").html();
	$.post(
		"php/generoi_pin_sijaiselle.php",
		{
			id: si_id,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#sijainenpin").html(replyObj[0].pin);
						if (!$("#sijainenpin").hasClass("sijainenpin_muokattu")) {
							$("#sijainenpin").addClass("sijainenpin_muokattu");
						}
				}
			}
		}
	);
}

function hallinta_tarkista_sijaisen_tila() {
	if ($("#sijainenaktiivinen_valinta").prop("checked") == true) {
		hallinta_tallenna_sijainen();
	} else {
		hallinta_nayta_sijainenTilaRuutu();
	}
}

function hallinta_tallenna_sijainen() {
	let si_id = $("#sijainenid").html();

	let si_nimi = $("#sijainennimi").val();
	let si_nimike_id = -1;
	if ($("#sijainennimike").prop("selectedIndex") != 0) {
		si_nimike_id = $("#sijainennimike option:selected").val();
	}

	let si_kotiosasto_id = -1;
	if ($("#sijainenkotiosasto").prop("selectedIndex") != 0) {
		si_kotiosasto_id = $("#sijainenkotiosasto option:selected").val();
	}

	let si_muut_osasto_idt = "";
	$("#sijainenmuutosastot input:checked:not(:disabled)").each(function () {
		si_muut_osasto_idt += "," + this.value;
	});

	if (si_muut_osasto_idt.length > 0) {
		si_muut_osasto_idt = si_muut_osasto_idt.substr(1);
	}

	let si_mahd_osasto_idt = "";
	$("#sijainenmahdosastot input:checked:not(:disabled)").each(function () {
		si_mahd_osasto_idt += "," + this.value;
	});

	if (si_mahd_osasto_idt.length > 0) {
		si_mahd_osasto_idt = si_mahd_osasto_idt.substr(1);
	}

	let si_kommentti = $("#sijainenkommentti").val();

	let si_iv = "";
	if ($("#sijainen_iv_valinta_0").prop("checked") == true) {
		si_iv = "-";
	} else if ($("#sijainen_iv_valinta_1").prop("checked") == true) {
		si_iv = "IV+";
	} else if ($("#sijainen_iv_valinta_2").prop("checked") == true) {
		si_iv = "IV-";
	} else if ($("#sijainen_iv_valinta_3").prop("checked") == true) {
		si_iv = "NHT";
	}

	let si_laakelupa = "-";
	if ($("#sijainen_laakelupa_valinta_0").prop("checked") == true) {
		si_laakelupa = 0;
	} else if ($("#sijainen_laakelupa_valinta_1").prop("checked") == true) {
		si_laakelupa = 1;
	}

	let si_toimialueet = "";
	$("#sijainentoimialueet input:checked").each(function () {
		si_toimialueet += "," + this.value;
	});

	if (si_toimialueet.length > 0) {
		si_toimialueet = si_toimialueet.substr(1);
	}

	let si_aktiivinen = 1;
	if ($("#sijainenaktiivinen_valinta").prop("checked") == false) {
		si_aktiivinen = 0;
	}

	let si_puhelin = $("#sijainenpuhnro").val();
	let si_sms = 0;
	if ($("#sijainensms_valinta").prop("checked") == true) {
		si_sms = 1;
		if (si_puhelin == "") {
			alert("Tarkista puhelinnumero");
			return;
		}
	}

	if (si_puhelin != "") {
		if (!si_puhelin.match(/^\d+$/)) {
			alert("Tarkista puhelinnumero (Syötä numerot ilman välimerkkejä)");
			return;
		}
	}

	if (
		si_nimi == "" ||
		si_nimike_id == -1 ||
		si_toimialueet == "" ||
		si_kotiosasto_id == -1 ||
		si_iv == "" ||
		si_laakelupa == "-"
	) {
		alert("Tarkista tiedot");
		return;
	}

	let si_pin = $("#sijainenpin").html();
	if (si_pin == "xxxx") {
		si_pin = null;
	}

	$.post(
		"php/tallenna_sijainen.php",
		{
			id: si_id,
			nimi: si_nimi,
			nimike_id: si_nimike_id,
			kotiosasto_id: si_kotiosasto_id,
			muut_osasto_idt: si_muut_osasto_idt,
			mahd_osasto_idt: si_mahd_osasto_idt,
			kommentti: si_kommentti,
			iv: si_iv,
			laakelupa: si_laakelupa,
			toimialueet: si_toimialueet,
			puhelin: si_puhelin,
			sms: si_sms,
			aktiivinen: si_aktiivinen,
			pin: si_pin,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Nimi tai pin on jo olemassa");
						break;

					default:
						nayta_tilaviesti("Sissin lisäys/päivitys onnistui");
						hallinta_hae_sijaiset();
						hallinta_nayta_sisalto("sijaiset", false);
						if (si_id == "") {
							$("#sijainennimi").val("");
							$("#sijainennimike").prop("selectedIndex", 0);
							$("#sijainenkotiosasto").prop("selectedIndex", 0);
							$("#sijainenmuutosastot")
								.find("input[type=checkbox]:checked")
								.prop("checked", false);
							$("#sijainenmuutosastot").scrollTop(0);
							$("#sijainenmahdosastot")
								.find("input[type=checkbox]:checked")
								.prop("checked", false);
							$("#sijainenmahdosastot").scrollTop(0);
							$("#sijainen_iv_0").prop("checked", true);
							$("#si_laakelupa").prop("checked", false);
							$("#sijainenkommentti").val("");
							$("#sijainentoimialueet")
								.find("input[type=checkbox]:checked")
								.prop("checked", false);
							$("#sijainentoimialueet").scrollTop(0);
							$("#sijainenaktiivinenvalintaKehys").hide();
							$("#sijainenaktiivinen_valinta").prop("checked", true);
							$("#sijainenpuhnro").val("");
							$("#sijainensms_valinta").prop("checked", false);
							$("#sijainenpin").html("xxxx");
							$("#sijainenpin").removeClass("sijainenpin_muokattu");
						} else {
							$("#sijainenTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_sijainenTilaRuutu() {
	let id = $("#sijainenid").html();
	let teksti =
		"Haluatko asettaa sissin " +
		$("#sijainen_nimi_" + id).html() +
		" tilaan ei aktiivinen?";
	$("#sijainenTilaRuutu").dialog("option", "title", teksti);
	$("#sijainenTilaRuutu").dialog("open");
}

function hallinta_nayta_sijainenPoistoRuutu() {
	let id = $("#sijainenid").html();
	$("#sijainenpoistoid").html(id);
	let teksti =
		"Haluatko poistaa sissin " + $("#sijainen_nimi_" + id).html() + "?";
	$("#sijainenPoistoRuutu").dialog("option", "title", teksti);
	$("#sijainenPoistoRuutu").dialog("open");
}

function hallinta_poista_sijainen() {
	let si_id = $("#sijainenpoistoid").html();

	if (si_id == "") {
		alert("Id virhe");
		return;
	}

	$.post("php/poista_sijainen.php", { id: si_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			nayta_tilaviesti("Sissin poisto onnistui");
			$("#sijainenpoistoid").html("");
			hallinta_hae_sijaiset();
			hallinta_nayta_sisalto("sijaiset", false);
			$("#sijainenTietoRuutu").dialog("close");
			$("#sijainenPoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_aseta_reservilainen_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == reservilainen_jarjestysarvo) {
		if (reservilainen_jarjestys == "DESC") {
			reservilainen_jarjestys = "ASC";
		} else {
			reservilainen_jarjestys = "DESC";
		}
	} else {
		reservilainen_jarjestysarvo = jarjestysarvo;
		reservilainen_jarjestys = "ASC";
	}

	hallinta_hae_reservilaiset();
}

function hallinta_hae_reservilainen_valinnat() {
	$("#reservihenkilokustannusreservilainen").html(
		"<option value='-1'>Valitse</option>"
	);
	$("#reservihenkilokustannusreservilainen").val(-1);

	$.post("php/hae_reservilainen_valinnat.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			if (replyObj.length > 0) {
				for (let i = 0; i < replyObj.length; i++) {
					$("#reservihenkilokustannusreservilainen").append(
						"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].nimi +
							"</option>"
					);
				}
			}
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_hae_reservilaiset() {
	let nimi = "";
	let suodatin_nimike = -1;
	let suodatin_toimialue = -1;
	let suodatin_reservilainentyyppi = -1;

	if ($("#reservilainentyyppisuodatin").val() != -1) {
		suodatin_reservilainentyyppi = $("#reservilainentyyppisuodatin").val();
	}

	if ($("#hakukohde option:selected").val() == "reservilaiset") {
		nimi = $("#hakukentta").val();
	}

	if ($("#reservi_nimikesuodatin").val() != 0) {
		suodatin_nimike = $("#reservi_nimikesuodatin").val();
	}

	if ($("#reservi_toimialuesuodatin").val() != 0) {
		suodatin_toimialue = $("#reservi_toimialuesuodatin").val();
	}

	$.post(
		"php/hae_reservilaiset.php",
		{
			nimike_id: suodatin_nimike,
			hakunimi: nimi,
			toimialue_id: suodatin_toimialue,
			reservilainentyyppi: suodatin_reservilainentyyppi,
			jarjestys: reservilainen_jarjestys,
			jarjestettavaarvo: reservilainen_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "[]":
						$("#reservilainendata").html("");
						$("#reservilainendata").append(
							"<tr>" +
								"<td colspan='4'><span>Reserviläisiä ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					case "parametri":
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#reservilainendata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let virhe = false;
							let id = replyObj[i].id;
							let aktiivinen_reservilainen = "";
							if (replyObj[i].aktiivinen == 0) {
								aktiivinen_reservilainen = " class='ei_aktiivinen'";
							}

							let nimi = replyObj[i].nimi;
							if (replyObj[i].aktiivinen == 0) {
								nimi = "(!) " + replyObj[i].nimi;
							}

							let rivitila = "";
							if (
								replyObj[i].toimialueet == null ||
								replyObj[i].nimike == null
							) {
								rivitila = "class='tarkista_rivi'";
								virhe = true;
							}

							let reservilainendata =
								"<tr id='reservilainen_rivi_" +
								id +
								"'" +
								aktiivinen_reservilainen +
								rivitila +
								">" +
								"<td><span id='reservilainen_nimi_" +
								id +
								"'>" +
								nimi +
								"</span></td>" +
								"<td><span id='reservilainen_nimike_" +
								id +
								"'>" +
								replyObj[i].nimike +
								"</span></td>" +
								"<td><span id='reservilainen_vakanssinumero_" +
								id +
								"'>" +
								replyObj[i].vakanssinumero +
								"</span></td>" +
								"<td><span id='reservilainen_toimialue_" +
								id +
								"'>" +
								replyObj[i].toimialueet +
								"</span></td>" +
								"</tr>";

							if (virhe) {
								$("#reservilainendata").prepend(reservilainendata);
							} else {
								$("#reservilainendata").append(reservilainendata);
							}

							$("#reservilainen_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_reservilainenTietoRuutu(
									$(this).prop("id").replace("reservilainen_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_nayta_reservilainenTietoRuutu(re_id) {
	$("#reservilainenTietoRuutu")
		.next(".ui-dialog-buttonpane")
		.find("button:contains('Poista')")
		.hide();
	$("#reservilainenid").html(re_id);
	$("#reservilainennimi").val("");
	$("#reservilainenvakanssinumero").val("");
	$("#reservilainennimike").val(0);
	$("#reservilainentoimialueet")
		.find("input[type=checkbox]:checked")
		.prop("checked", false);
	$("#reservilainentoimialueet").scrollTop(0);
	$("#reservilainenaktiivinenvalintaKehys").hide();
	$("#reservilainenaktiivinen_valinta").prop("checked", true);
	$("#reservilainenTietoRuutu").dialog(
		"option",
		"title",
		"Lisää reservilainen"
	);

	if (re_id != "") {
		$("#reservilainenaktiivinenvalintaKehys").show();
		$("#reservilainenTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa reserviläisen tietoja"
		);
		$("#reservilainenTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#reservilainen_id").html(re_id);

		$.post("php/hae_reservilaisen_tiedot.php", { id: re_id }, function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "[]":
						alert("Reserviläisen tietoja ei löytynyt");
						break;

					case "parametri":
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#reservilainenvakanssinumero").val(replyObj[0].vakanssinumero);
						$("#reservilainennimi").val(replyObj[0].nimi);
						$("#reservilainennimike").val(replyObj[0].nimike_id);

						if (replyObj[0].toimialue_idt != null) {
							let toimialue_idt = replyObj[0].toimialue_idt.split(",");
							$.each(toimialue_idt, function (i, val) {
								$("#reservilainentoimialueet input[value='" + val + "']").prop(
									"checked",
									true
								);
							});
						}

						if (replyObj[0].aktiivinen == 0) {
							$("#reservilainenaktiivinen_valinta").prop("checked", false);
						}

						$("#reservilainenTietoRuutu").dialog("open");
				}
			}
		});
	} else {
		$("#reservilainenTietoRuutu").dialog("open");
	}
}

function hallinta_tarkista_reservilaisen_tila() {
	if ($("#reservilainenaktiivinen_valinta").prop("checked") == true) {
		hallinta_tallenna_reservilainen();
	} else {
		hallinta_nayta_reservilainenTilaRuutu();
	}
}

function hallinta_tallenna_reservilainen() {
	let re_id = $("#reservilainenid").html();
	let re_vakanssinumero = $("#reservilainenvakanssinumero").val();
	let re_nimi = $("#reservilainennimi").val();
	let re_nimike_id = -1;
	if ($("#reservilainennimike").val() != 0) {
		re_nimike_id = $("#reservilainennimike option:selected").val();
	}

	let re_aktiivinen = 1;
	if ($("#reservilainenaktiivinen_valinta").prop("checked") == false) {
		re_aktiivinen = 0;
	}

	let re_toimialueet = "";
	$("#reservilainentoimialueet input:checked").each(function () {
		re_toimialueet += "," + this.value;
	});

	if (re_toimialueet.length > 0) {
		re_toimialueet = re_toimialueet.substr(1);
	}

	if (
		re_vakanssinumero == "" ||
		re_nimi == "" ||
		re_nimike_id == -1 ||
		re_toimialueet == ""
	) {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_reservilainen.php",
		{
			id: re_id,
			vakanssinumero: re_vakanssinumero,
			nimi: re_nimi,
			nimike_id: re_nimike_id,
			toimialueet: re_toimialueet,
			aktiivinen: re_aktiivinen,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Nimi ja/tai vakanssinumero on jo olemassa");
						break;

					default:
						nayta_tilaviesti("Reserviläisen lisäys/päivitys onnistui");
						hallinta_hae_reservilaiset();
						hallinta_nayta_sisalto("reservilaiset", false);
						if (re_id == "") {
							$("#reservilainennimi").val("");
							$("#reservilainenvakanssinumero").val("");
							$("#reservilainennimike").val(0);
							$("#reservilainenaktiivinenvalintaKehys").hide();
							$("#reservilainenaktiivinen_valinta").prop("checked", true);
							$("#reservilainentoimialueet")
								.find("input[type=checkbox]:checked")
								.prop("checked", false);
						} else {
							$("#reservilainenTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_reservilainenTilaRuutu() {
	let id = $("#reservilainenid").html();
	let teksti =
		"Haluatko asettaa reserviläisen " +
		$("#reservilainen_nimi_" + id).html() +
		" tilaan ei aktiivinen?";
	$("#reservilainenTilaRuutu").dialog("option", "title", teksti);
	$("#reservilainenTilaRuutu").dialog("open");
}

function hallinta_nayta_reservilainenPoistoRuutu() {
	let id = $("#reservilainenid").html();
	$("#reservilainenpoistoid").html(id);
	let teksti =
		"Haluatko poistaa reserviläisen " +
		$("#reservilainen_nimi_" + id).html() +
		"?";
	$("#reservilainenPoistoRuutu").dialog("option", "title", teksti);
	$("#reservilainenPoistoRuutu").dialog("open");
}

function hallinta_poista_reservilainen() {
	let re_id = $("#reservilainenpoistoid").html();

	if (re_id == "") {
		alert("Id virhe");
		return;
	}

	$.post("php/poista_reservilainen.php", { id: re_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			nayta_tilaviesti("Reserviläisen poisto onnistui");
			$("#reservilainenpoistoid").html("");
			hallinta_hae_reservilaiset();
			hallinta_nayta_sisalto("reservilaiset", false);
			$("#reservilainenTietoRuutu").dialog("close");
			$("#reservilainenPoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_aseta_sihteeri_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == sihteeri_jarjestysarvo) {
		if (sihteeri_jarjestys == "DESC") {
			sihteeri_jarjestys = "ASC";
		} else {
			sihteeri_jarjestys = "DESC";
		}
	} else {
		sihteeri_jarjestysarvo = jarjestysarvo;
		sihteeri_jarjestys = "ASC";
	}

	hallinta_hae_sihteerit();
}

function hallinta_hae_sihteerit() {
	let nimi = "";
	let suodatin_nimike = -1;
	let suodatin_palvelualue = -1;
	let suodatin_sihteerityyppi = -1;

	if ($("#sihteerityyppisuodatin").val() != -1) {
		suodatin_sihteerityyppi = $("#sihteerityyppisuodatin").val();
	}

	if ($("#hakukohde option:selected").val() == "sihteerit") {
		nimi = $("#hakukentta").val();
	}

	if ($("#sihteeri_nimikesuodatin").val() != 0) {
		suodatin_nimike = $("#sihteeri_nimikesuodatin").val();
	}

	if ($("#sihteeri_palvelualuesuodatin").val() != 0) {
		suodatin_toimialue = $("#sihteeri_palvelualuesuodatin").val();
	}

	$.post(
		"php/hae_sihteerit.php",
		{
			nimike_id: suodatin_nimike,
			hakunimi: nimi,
			palvelualue_id: suodatin_palvelualue,
			sihteerityyppi: suodatin_sihteerityyppi,
			jarjestys: sihteeri_jarjestys,
			jarjestettavaarvo: sihteeri_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "[]":
						$("#sihteeridata").html("");
						$("#sihteeridata").append(
							"<tr>" +
								"<td colspan='4'><span>Sihteereitä ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					case "parametri":
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#sihteeridata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let virhe = false;
							let id = replyObj[i].id;
							let aktiivinen_sihteeri = "";
							if (replyObj[i].aktiivinen == 0) {
								aktiivinen_sihteeri = " class='ei_aktiivinen'";
							}

							let nimi = replyObj[i].nimi;
							if (replyObj[i].aktiivinen == 0) {
								nimi = "(!) " + replyObj[i].nimi;
							}

							let rivitila = "";
							if (
								replyObj[i].palvelualueet == null ||
								replyObj[i].nimike == null
							) {
								rivitila = "class='tarkista_rivi'";
								virhe = true;
							}

							let sihteeridata =
								"<tr id='sihteeri_rivi_" +
								id +
								"'" +
								aktiivinen_sihteeri +
								rivitila +
								">" +
								"<td><span id='sihteeri_nimi_" +
								id +
								"'>" +
								nimi +
								"</span></td>" +
								"<td><span id='sihteeri_nimike_" +
								id +
								"'>" +
								replyObj[i].nimike +
								"</span></td>" +
								"<td><span id='sihteeri_vakanssinumero_" +
								id +
								"'>" +
								replyObj[i].vakanssinumero +
								"</span></td>" +
								"<td><span id='sihteeri_palvelualue_" +
								id +
								"'>" +
								replyObj[i].palvelualueet +
								"</span></td>" +
								"</tr>";

							if (virhe) {
								$("#sihteeridata").prepend(sihteeridata);
							} else {
								$("#sihteeridata").append(sihteeridata);
							}

							$("#sihteeri_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_sihteeriTietoRuutu(
									$(this).prop("id").replace("sihteeri_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_nayta_sihteeriTietoRuutu(sih_id) {
	$("#sihteeriTietoRuutu")
		.next(".ui-dialog-buttonpane")
		.find("button:contains('Poista')")
		.hide();
	$("#sihteeriid").html(sih_id);
	$("#sihteerinimi").val("");
	$("#sihteerivakanssinumero").val("");
	$("#sihteerinimike").val(0);
	$("#sihteeripalvelualueet")
		.find("input[type=checkbox]:checked")
		.prop("checked", false);
	$("#sihteeripalvelualueet").scrollTop(0);
	$("#sihteeriaktiivinenvalintaKehys").hide();
	$("#sihteeriaktiivinen_valinta").prop("checked", true);
	$("#sihteeriTietoRuutu").dialog("option", "title", "Lisää sihteeri");

	if (sih_id != "") {
		$("#sihteeriaktiivinenvalintaKehys").show();
		$("#sihteeriTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa sihteerin tietoja"
		);
		$("#sihteeriTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#sihteeri_id").html(sih_id);

		$.post("php/hae_sihteerin_tiedot.php", { id: sih_id }, function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "[]":
						alert("Sihteerin tietoja ei löytynyt");
						break;

					case "parametri":
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#sihteerivakanssinumero").val(replyObj[0].vakanssinumero);
						$("#sihteerinimi").val(replyObj[0].nimi);
						$("#sihteerinimike").val(replyObj[0].nimike_id);

						if (replyObj[0].palvelualue_idt != null) {
							let palvelualue_idt = replyObj[0].palvelualue_idt.split(",");
							$.each(palvelualue_idt, function (i, val) {
								$("#sihteeripalvelualueet input[value='" + val + "']").prop(
									"checked",
									true
								);
							});
						}

						if (replyObj[0].aktiivinen == 0) {
							$("#sihteeriaktiivinen_valinta").prop("checked", false);
						}

						$("#sihteeriTietoRuutu").dialog("open");
				}
			}
		});
	} else {
		$("#sihteeriTietoRuutu").dialog("open");
	}
}

function hallinta_tarkista_sihteerin_tila() {
	if ($("#sihteeriaktiivinen_valinta").prop("checked") == true) {
		hallinta_tallenna_sihteeri();
	} else {
		hallinta_nayta_sihteeriTilaRuutu();
	}
}

function hallinta_tallenna_sihteeri() {
	let sih_id = $("#sihteeriid").html();
	let sih_vakanssinumero = $("#sihteerivakanssinumero").val();
	let sih_nimi = $("#sihteerinimi").val();
	let sih_nimike_id = -1;
	if ($("#sihteerinimike").val() != 0) {
		sih_nimike_id = $("#sihteerinimike option:selected").val();
	}

	let sih_aktiivinen = 1;
	if ($("#sihteeriaktiivinen_valinta").prop("checked") == false) {
		sih_aktiivinen = 0;
	}

	let sih_palvelualueet = "";
	$("#sihteeripalvelualueet input:checked").each(function () {
		sih_palvelualueet += "," + this.value;
	});

	if (sih_palvelualueet.length > 0) {
		sih_palvelualueet = sih_palvelualueet.substr(1);
	}

	if (
		sih_vakanssinumero == "" ||
		sih_nimi == "" ||
		sih_nimike_id == -1 ||
		sih_palvelualueet == ""
	) {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_sihteeri.php",
		{
			id: sih_id,
			vakanssinumero: sih_vakanssinumero,
			nimi: sih_nimi,
			nimike_id: sih_nimike_id,
			palvelualueet: sih_palvelualueet,
			aktiivinen: sih_aktiivinen,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Nimi ja/tai vakanssinumero on jo olemassa");
						break;

					default:
						nayta_tilaviesti("Sihteerin lisäys/päivitys onnistui");
						hallinta_hae_sihteerit();
						hallinta_nayta_sisalto("sihteerit", false);
						if (sih_id == "") {
							$("#sihteerinimi").val("");
							$("#sihteerivakanssinumero").val("");
							$("#sihteerinimike").val(0);
							$("#sihteeriaktiivinenvalintaKehys").hide();
							$("#sihteeriaktiivinen_valinta").prop("checked", true);
							$("#sihteeripalvelualueet")
								.find("input[type=checkbox]:checked")
								.prop("checked", false);
						} else {
							$("#sihteeriTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_sihteeriTilaRuutu() {
	let id = $("#sihteeriid").html();
	let teksti =
		"Haluatko asettaa sihteerin " +
		$("#sihteeri_nimi_" + id).html() +
		" tilaan ei aktiivinen?";
	$("#sihteeriTilaRuutu").dialog("option", "title", teksti);
	$("#sihteeriTilaRuutu").dialog("open");
}

function hallinta_nayta_sihteeriPoistoRuutu() {
	let id = $("#sihteeriid").html();
	$("#sihteeripoistoid").html(id);
	let teksti =
		"Haluatko poistaa sihteerin " + $("#sihteeri_nimi_" + id).html() + "?";
	$("#sihteeriPoistoRuutu").dialog("option", "title", teksti);
	$("#sihteeriPoistoRuutu").dialog("open");
}

function hallinta_poista_sihteeri() {
	let re_id = $("#sihteeripoistoid").html();

	if (re_id == "") {
		alert("Id virhe");
		return;
	}

	$.post("php/poista_sihteeri.php", { id: re_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			nayta_tilaviesti("Sihteerin poisto onnistui");
			$("#sihteeripoistoid").html("");
			hallinta_hae_sihteerit();
			hallinta_nayta_sisalto("sihteerit", false);
			$("#sihteeriTietoRuutu").dialog("close");
			$("#sihteeriPoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_aseta_nimike_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == nimike_jarjestysarvo) {
		if (nimike_jarjestys == "DESC") {
			nimike_jarjestys = "ASC";
		} else {
			nimike_jarjestys = "DESC";
		}
	} else {
		nimike_jarjestysarvo = jarjestysarvo;
		nimike_jarjestys = "ASC";
	}

	hallinta_hae_nimikkeet();
}

function hallinta_hae_nimikkeet() {
	let haku_sana = "";
	if ($("#hakukohde option:selected").val() == "nimikkeet") {
		haku_sana = $("#hakukentta").val();
	}

	$.post(
		"php/hae_nimikkeet.php",
		{
			hakusana: haku_sana,
			jarjestys: nimike_jarjestys,
			jarjestettavaarvo: nimike_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "[]":
						$("#nimikedata").html("");
						$("#nimikedata").append(
							"<tr>" +
								"<td colspan='2'><span>Nimikkeitä ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#nimikedata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let id = replyObj[i].id;
							$("#nimikedata").append(
								"<tr id='nimike_rivi_" +
									id +
									"'>" +
									"<td><span id='nimike_lyhenne_" +
									id +
									"'>" +
									replyObj[i].lyhenne +
									"</span></td>" +
									"<td><span id='nimike_nimi_" +
									id +
									"'>" +
									replyObj[i].nimi +
									"</span></td>" +
									"</tr>"
							);

							$("#nimike_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_nimikeTietoRuutu(
									$(this).prop("id").replace("nimike_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_hae_nimike_valinnat() {
	$("#sijainennimike").html("");
	$("#reservilainennimike").html("");
	$("#sihteerinimike").html("");
	$("#nimikesuodatin").html("");
	$("#sihteeri_nimikesuodatin").html("");
	$("#reservi_nimikesuodatin").html("");
	$("#sijainennimike").append("<option value='0'>Valitse</option>");
	$("#reservilainennimike").append("<option value='0'>Valitse</option>");
	$("#sihteerinimike").append("<option value='0'>Valitse</option>");
	$("#nimikesuodatin").append("<option value='0'>Kaikki</option>");
	$("#reservi_nimikesuodatin").append("<option value='0'>Kaikki</option>");
	$("#sihteeri_nimikesuodatin").append("<option value='0'>Kaikki</option>");
	$("#sijainennimike").val(0);
	$("#reservilainennimike").val(0);
	$("#sihteerinimike").val(0);
	$("#nimikesuodatin").val(0);
	$("#reservi_nimikesuodatin").val(0);
	$("#sihteeri_nimikesuodatin").val(0);

	$.post("php/hae_nimike_valinnat.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			if (replyObj.length > 0) {
				for (let i = 0; i < replyObj.length; i++) {
					$("#sijainennimike").append(
						"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].nimi +
							"</option>"
					);
					$("#reservilainennimike").append(
						"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].nimi +
							"</option>"
					);
					$("#sihteerinimike").append(
						"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].nimi +
							"</option>"
					);
					$("#nimikesuodatin").append(
						"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].nimi +
							"</option>"
					);
					$("#reservi_nimikesuodatin").append(
						"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].nimi +
							"</option>"
					);
					$("#sihteeri_nimikesuodatin").append(
						"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].nimi +
							"</option>"
					);
				}
			}
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_nayta_nimikeTietoRuutu(id) {
	if (id != "") {
		$("#nimikeid").html(id);
		$("#nimikelyhytnimi").val($("#nimike_lyhenne_" + id).html());
		$("#nimikekokonimi").val($("#nimike_nimi_" + id).html());
		$("#nimikeTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#nimikeTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa nimikkeen tietoja"
		);
	} else {
		$("#nimikeid").html("");
		$("#nimikelyhytnimi").val("");
		$("#nimikekokonimi").val("");
		$("#nimikeTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.hide();
		$("#nimikeTietoRuutu").dialog("option", "title", "Lisää nimike");
	}
	$("#nimikeTietoRuutu").dialog("open");
}

function hallinta_tallenna_nimike() {
	let n_id = $("#nimikeid").html();
	let n_lyhenne = $("#nimikelyhytnimi").val();
	let n_nimi = $("#nimikekokonimi").val();

	if (n_lyhenne == "" || n_nimi == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_nimike.php",
		{ id: n_id, lyhenne: n_lyhenne, nimi: n_nimi },
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Nimike on jo olemassa");
						break;

					default:
						nayta_tilaviesti("Nimikkeen lisäys/päivitys onnistui");
						hallinta_hae_nimikkeet();
						hallinta_hae_nimike_valinnat();
						hallinta_nayta_sisalto("nimikkeet", false);
						if (n_id == "") {
							$("#nimikelyhytnimi").val("");
							$("#nimikekokonimi").val("");
						} else {
							$("#nimikeTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_nimikePoistoRuutu() {
	let id = $("#nimikeid").html();
	$("#nimikepoistoid").html(id);
	let teksti =
		"Haluatko poistaa nimikkeen " + $("#nimike_nimi_" + id).html() + "?";
	$("#nimikePoistoRuutu").dialog("option", "title", teksti);
	$("#nimikePoistoRuutu").dialog("open");
}

function hallinta_poista_nimike() {
	let n_id = $("#nimikepoistoid").html();

	if (n_id == "") {
		alert("Id virhe");
		return;
	}

	$.post("php/poista_nimike.php", { id: n_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			nayta_tilaviesti("Nimikkeen poisto onnistui");
			$("#nimikepoistoid").html("");
			hallinta_hae_nimikkeet();
			hallinta_hae_nimike_valinnat();
			hallinta_nayta_sisalto("nimikkeet", false);
			$("#nimikeTietoRuutu").dialog("close");
			$("#nimikePoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_aseta_toimialue_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == toimialue_jarjestysarvo) {
		if (toimialue_jarjestys == "DESC") {
			toimialue_jarjestys = "ASC";
		} else {
			toimialue_jarjestys = "DESC";
		}
	} else {
		toimialue_jarjestysarvo = jarjestysarvo;
		toimialue_jarjestys = "ASC";
	}

	hallinta_hae_toimialueet();
}

function hallinta_hae_toimialueet() {
	let haku_sana = "";
	if ($("#hakukohde option:selected").val() == "toimialueet") {
		haku_sana = $("#hakukentta").val();
	}

	$.post(
		"php/hae_toimialueet.php",
		{
			hakusana: haku_sana,
			jarjestys: toimialue_jarjestys,
			jarjestettavaarvo: toimialue_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "[]":
						$("#toimialuedata").html("");
						$("#toimialuedata").append(
							"<tr>" +
								"<td colspan='3'><span>toimialueita ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#toimialuedata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let id = replyObj[i].id;
							let rivitila = "";

							if (replyObj[i].aktiivinen == 0) {
								rivitila = "class='ei_aktiivinen'";
							}

							$("#toimialuedata").append(
								"<tr id='toimialue_rivi_" +
									id +
									"'" +
									rivitila +
									" data-aktiivinen='" +
									replyObj[i].aktiivinen +
									"'>" +
									"<td><span id='toimialue_lyhenne_" +
									id +
									"'>" +
									replyObj[i].lyhenne +
									"</span></td>" +
									"<td><span id='toimialue_nimi_" +
									id +
									"'>" +
									replyObj[i].nimi +
									"</span></td>" +
									"<td><span id='toimialue_vari_" +
									id +
									"' class='vari_hex_esikatselu' style='background:" +
									replyObj[i].vari_hex +
									"; color:" +
									replyObj[i].vari_hex +
									"'>" +
									replyObj[i].vari_hex +
									"</span></td>" +
									"</tr>"
							);

							$("#toimialue_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_toimialueTietoRuutu(
									$(this).prop("id").replace("toimialue_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_hae_toimialuevalinnat() {
	$("#kayttajatoimialueet").html("");
	$("#sijainentoimialueet").html("");
	$("#reservilainentoimialueet").html("");
	$("#toimialuesuodatin").html("<option value='0' selected>Kaikki</option>");
	$("#reservi_toimialuesuodatin").html(
		"<option value='0' selected>Kaikki</option>"
	);
	$("#osastotoimialue").html(
		"<option value='-1' selected>Valitse</option><option value='0'>Kaikki</option>"
	);

	$.post("php/hae_kaikki_toimialue_valinnat.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			for (let i = 0; i < replyObj.length; i++) {
				$("#kayttajatoimialueet").append(
					"<div class='valinta_rivi'>" +
						"<input type='checkbox' value='" +
						replyObj[i].id +
						"' />" +
						"<span class='valinta_rivi_teksti'>" +
						replyObj[i].nimi +
						"</span>" +
						"</div>"
				);

				$("#sijainentoimialueet").append(
					"<div class='toimialue_valinta_rivi'>" +
						"<input id='sijainen_toimialue_valinta_" +
						replyObj[i].id +
						"' type='checkbox' value='" +
						replyObj[i].id +
						"' />" +
						"<span class='valinta_rivi_teksti'>" +
						replyObj[i].nimi +
						"</span>" +
						"</div>"
				);

				$("#reservilainentoimialueet").append(
					"<div class='toimialue_valinta_rivi'>" +
						"<input type='checkbox' value='" +
						replyObj[i].id +
						"' />" +
						"<span class='valinta_rivi_teksti'>" +
						replyObj[i].nimi +
						"</span>" +
						"</div>"
				);

				$("#osastotoimialue").append(
					"<option value='" +
						replyObj[i].id +
						"'>" +
						replyObj[i].nimi +
						"</option>"
				);
				$("#toimialuesuodatin").append(
					"<option value='" +
						replyObj[i].id +
						"'>" +
						replyObj[i].nimi +
						"</option>"
				);
				$("#reservi_toimialuesuodatin").append(
					"<option value='" +
						replyObj[i].id +
						"'>" +
						replyObj[i].nimi +
						"</option>"
				);
			}

			$("#sijainentoimialueet input").click(function () {
				let id = $(this).prop("id").replace("sijainen_toimialue_valinta_", "");
				if ($(this).prop("checked") == true) {
					$(
						"#sijainenmuutosastot .sijainen_muuosasto_toimialue_" + id
					).removeClass("piilotettu");
					$(
						"#sijainenmahdosastot .sijainen_mahdosasto_toimialue_" + id
					).removeClass("piilotettu");
					$(
						"#sijainenkotiosasto .sijainen_kotiosasto_toimialue_" + id
					).removeClass("piilotettu");
				} else {
					$(
						"#sijainenkotiosasto .sijainen_kotiosasto_toimialue_" + id
					).addClass("piilotettu");
					$(
						"#sijainenmahdosastot .sijainen_mahdosasto_toimialue_" + id
					).addClass("piilotettu");
					$(
						"#sijainenmuutosastot .sijainen_muuosasto_toimialue_" + id
					).addClass("piilotettu");

					let kotiosastovalinta = $("#sijainenkotiosasto").val();
					if (
						$(
							"#sijainenkotiosasto option[value='" + kotiosastovalinta + "']"
						).hasClass("piilotettu")
					) {
						$("#sijainenkotiosasto").val(0);
					}

					$(
						"#sijainenmuutosastot .sijainen_muuosasto_toimialue_" +
							id +
							" input:checked"
					).each(function () {
						$(this).prop("checked", false);
					});

					$(
						"#sijainenmahdosastot .sijainen_mahdosasto_toimialue_" +
							id +
							" input:checked"
					).each(function () {
						$(this).prop("checked", false);
					});
				}
			});
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_nayta_toimialueTietoRuutu(id) {
	$("#toimialueid").html("");
	$("#toimialuelyhenne").val("");
	$("#toimialuenimi").val("");
	$("#toimialuevari").css("background-color", "#ffffff");
	$("#toimialuevari").data("vari", "#ffffff");
	$("#toimialueaktiivinen_valinta").prop("checked", true);
	$("#toimialueTietoRuutu")
		.next(".ui-dialog-buttonpane")
		.find("button:contains('Poista')")
		.hide();
	$("#toimialueTietoRuutu").dialog("option", "title", "Lisää toimialue");

	if (id != "") {
		$("#toimialueid").html(id);
		$("#toimialuelyhenne").val($("#toimialue_lyhenne_" + id).html());
		$("#toimialuenimi").val($("#toimialue_nimi_" + id).html());
		let vari = $("#toimialue_vari_" + id).html();
		$("#toimialuevari").css("background-color", vari);
		$("#toimialuevari").data("vari", vari);
		if ($("#toimialue_rivi_" + id).data("aktiivinen") == 0) {
			$("#toimialueaktiivinen_valinta").prop("checked", false);
		}
		$("#toimialueTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#toimialueTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa toimialueen tietoja"
		);
	}

	$("#toimialueTietoRuutu").dialog("open");
}

function hallinta_tallenna_toimialue() {
	let t_id = $("#toimialueid").html();
	let t_lyhenne = $("#toimialuelyhenne").val();
	let t_nimi = $("#toimialuenimi").val();
	let t_vari = $("#toimialuevari").data("vari");
	let t_aktiivinen = 1;
	if ($("#toimialueaktiivinen_valinta").prop("checked") == false) {
		t_aktiivinen = 0;
	}

	if (t_lyhenne == "" || t_nimi == "" || t_vari == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_toimialue.php",
		{
			id: t_id,
			lyhenne: t_lyhenne,
			nimi: t_nimi,
			vari_hex: t_vari,
			aktiivinen: t_aktiivinen,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Toimialue on jo olemassa");
						break;

					default:
						nayta_tilaviesti("Toimialueen lisäys/päivitys onnistui");
						hallinta_hae_toimialueet();
						hallinta_hae_toimialuevalinnat();
						hallinta_nayta_sisalto("toimialueet", false);
						if (t_id == "") {
							$("#toimialuelyhenne").val("");
							$("#toimialuenimi").val("");
							$("#toimialuevari").css("background-color", "#ffffff");
							$("#toimialuevari").data("vari", "#ffffff");
							$("#toimialueaktiivinen_valinta").prop("checked", true);
						} else {
							$("#toimialueTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_toimialuePoistoRuutu() {
	let id = $("#toimialueid").html();
	$("#toimialuepoistoid").html(id);
	let teksti =
		"Haluatko poistaa toimialueen " + $("#toimialue_nimi_" + id).html() + "?";
	$("#toimialuePoistoRuutu").dialog("option", "title", teksti);
	$("#toimialuePoistoRuutu").dialog("open");
}

function hallinta_poista_toimialue() {
	let t_id = $("#toimialuepoistoid").html();

	if (t_id == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post("php/poista_toimialue.php", { id: t_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			nayta_tilaviesti("Toimialueen poisto onnistui");
			$("#toimialuepoistoid").html("");
			hallinta_hae_toimialueet();
			hallinta_hae_toimialuevalinnat();
			hallinta_nayta_sisalto("toimialueet", false);
			$("#toimialueTietoRuutu").dialog("close");
			$("#toimialuePoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_aseta_palvelualue_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == palvelualue_jarjestysarvo) {
		if (palvelualue_jarjestys == "DESC") {
			palvelualue_jarjestys = "ASC";
		} else {
			palvelualue_jarjestys = "DESC";
		}
	} else {
		palvelualue_jarjestysarvo = jarjestysarvo;
		palvelualue_jarjestys = "ASC";
	}

	hallinta_hae_palvelualueet();
}

function hallinta_hae_palvelualueet() {
	let haku_sana = "";
	if ($("#hakukohde option:selected").val() == "palvelualueet") {
		haku_sana = $("#hakukentta").val();
	}

	$.post(
		"php/hae_palvelualueet.php",
		{
			hakusana: haku_sana,
			jarjestys: palvelualue_jarjestys,
			jarjestettavaarvo: palvelualue_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "[]":
						$("#palvelualuedata").html("");
						$("#palvelualuedata").append(
							"<tr>" +
								"<td colspan='4'><span>Palvelualueita ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#palvelualuedata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let id = replyObj[i].id;
							$("#palvelualuedata").append(
								"<tr id='palvelualue_rivi_" +
									id +
									"'>" +
									"<td><span id='palvelualue_kustannusnumero_" +
									id +
									"'>" +
									replyObj[i].kustannusnumero +
									"</span></td>" +
									"<td><span id='palvelualue_lyhenne_" +
									id +
									"'>" +
									replyObj[i].lyhenne +
									"</span></td>" +
									"<td><span id='palvelualue_nimi_" +
									id +
									"'>" +
									replyObj[i].nimi +
									"</span></td>" +
									"<td><span id='palvelualue_vari_" +
									id +
									"' class='vari_hex_esikatselu' style='background:" +
									replyObj[i].vari_hex +
									"; color:" +
									replyObj[i].vari_hex +
									"'>" +
									replyObj[i].vari_hex +
									"</span></td>" +
									"</tr>"
							);

							$("#palvelualue_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_palvelualueTietoRuutu(
									$(this).prop("id").replace("palvelualue_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_hae_palvelualuevalinnat() {
	$("#sihteeripalvelualueet").html("");
	$("#osastopalvelualue").html(
		"<option value='-1' selected>Valitse</option><option value='0'>Kaikki</option>"
	);
	$("#sihteeri_palvelualuesuodatin").html("<option value='0'>Kaikki</option>");
	let valitut_palvelualue_idt = -1;

	$.post(
		"php/hae_palvelualue_valinnat.php",
		{ palvelualue_idt: valitut_palvelualue_idt },
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				for (let i = 0; i < replyObj.length; i++) {
					$("#sihteeripalvelualueet").append(
						"<div class='palvelualue_valinta_rivi'>" +
							"<input type='checkbox' value='" +
							replyObj[i].id +
							"' />" +
							"<span class='valinta_rivi_teksti'>" +
							replyObj[i].nimi +
							"</span>" +
							"</div>"
					);

					$("#osastopalvelualue").append(
						"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].nimi +
							"</option>"
					);
					$("#sihteeri_palvelualuesuodatin").append(
						"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].nimi +
							"</option>"
					);
				}
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function hallinta_nayta_palvelualueTietoRuutu(id) {
	if (id != "") {
		$("#palvelualueid").html(id);
		$("#palvelualuekustannusnumero").val(
			$("#palvelualue_kustannusnumero_" + id).html()
		);
		$("#palvelualuelyhenne").val($("#palvelualue_lyhenne_" + id).html());
		$("#palvelualuenimi").val($("#palvelualue_nimi_" + id).html());
		let vari = $("#palvelualue_vari_" + id).html();
		$("#palvelualuevari").css("background-color", vari);
		$("#palvelualuevari").data("vari", vari);
		$("#palvelualueTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#palvelualueTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa palvelualueen tietoja"
		);
	} else {
		$("#palvelualueid").html("");
		$("#palvelualuekustannusnumero").val("");
		$("#palvelualuelyhenne").val("");
		$("#palvelualuenimi").val("");
		$("#palvelualuevari").css("background-color", "#ffffff");
		$("#palvelualuevari").data("vari", "#ffffff");
		$("#palvelualueTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.hide();
		$("#palvelualueTietoRuutu").dialog("option", "title", "Lisää palvelualue");
	}
	$("#palvelualueTietoRuutu").dialog("open");
}

function hallinta_tallenna_palvelualue() {
	let p_id = $("#palvelualueid").html();
	let p_kustannusnumero = $("#palvelualuekustannusnumero").val();
	let p_lyhenne = $("#palvelualuelyhenne").val();
	let p_nimi = $("#palvelualuenimi").val();
	let p_vari = $("#palvelualuevari").data("vari");

	if (
		p_kustannusnumero == "" ||
		p_lyhenne == "" ||
		p_nimi == "" ||
		p_vari == ""
	) {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_palvelualue.php",
		{
			id: p_id,
			kustannusnumero: p_kustannusnumero,
			lyhenne: p_lyhenne,
			nimi: p_nimi,
			vari_hex: p_vari,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Palvelualue on jo olemassa");
						break;

					default:
						nayta_tilaviesti("Palvelualueen lisäys/päivitys onnistui");
						hallinta_hae_palvelualueet();
						hallinta_hae_palvelualuevalinnat();
						hallinta_nayta_sisalto("palvelualueet", false);
						if (p_id == "") {
							$("#palvelualuekustannusnumero").val("");
							$("#palvelualuelyhenne").val("");
							$("#palvelualuenimi").val("");
							$("#palvelualuevari").css("background-color", "#ffffff");
							$("#palvelualuevari").data("vari", "#ffffff");
						} else {
							$("#palvelualueTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_palvelualuePoistoRuutu() {
	let id = $("#palvelualueid").html();
	$("#palvelualuepoistoid").html(id);
	let teksti =
		"Haluatko poistaa palvelualueen " +
		$("#palvelualue_nimi_" + id).html() +
		"?";
	$("#palvelualuePoistoRuutu").dialog("option", "title", teksti);
	$("#palvelualuePoistoRuutu").dialog("open");
}

function hallinta_poista_palvelualue() {
	let p_id = $("#palvelualuepoistoid").html();

	if (p_id == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post("php/poista_palvelualue.php", { id: p_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			nayta_tilaviesti("Palvelualueen poisto onnistui");
			$("#palvelualuepoistoid").html("");
			hallinta_hae_palvelualueet();
			hallinta_hae_palvelualuevalinnat();
			hallinta_nayta_sisalto("palvelualueet", false);
			$("#palvelualueTietoRuutu").dialog("close");
			$("#palvelualuePoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_aseta_osasto_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == osasto_jarjestysarvo) {
		if (osasto_jarjestys == "DESC") {
			osasto_jarjestys = "ASC";
		} else {
			osasto_jarjestys = "DESC";
		}
	} else {
		osasto_jarjestysarvo = jarjestysarvo;
		osasto_jarjestys = "ASC";
	}

	hallinta_hae_osastot();
}

function hallinta_hae_osastot() {
	let haku_sana = "";
	if ($("#hakukohde option:selected").val() == "osastot") {
		haku_sana = $("#hakukentta").val();
	}

	let suodatin_osastotyyppi = -1;
	if ($("#osastotyyppisuodatin").val() != -1) {
		suodatin_osastotyyppi = $("#osastotyyppisuodatin").val();
	}

	$.post(
		"php/hae_osastot.php",
		{
			hakusana: haku_sana,
			osastotyyppi: suodatin_osastotyyppi,
			jarjestys: osasto_jarjestys,
			jarjestettavaarvo: osasto_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#osastodata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);

						for (let i = 1; i < replyObj.length; i++) {
							let virhe = false;
							let id = replyObj[i].id;

							let rivitila = "";
							if (
								replyObj[i].toimialue == null ||
								replyObj[i].palvelualue == null
							) {
								rivitila = "class='tarkista_rivi'";
								virhe = true;
							} else if (replyObj[i].aktiivinen == 0) {
								rivitila = "class='ei_aktiivinen'";
							}

							let osastodata =
								"<tr id='osasto_rivi_" +
								id +
								"'" +
								rivitila +
								" data-aktiivinen='" +
								replyObj[i].aktiivinen +
								"'>" +
								"<td class='piilotettu'><span id='osasto_toimialue_id_" +
								id +
								"'>" +
								replyObj[i].toimialue_id +
								"</span></td>" +
								"<td class='piilotettu'><span id='osasto_palvelualue_id_" +
								id +
								"'>" +
								replyObj[i].palvelualue_id +
								"</span></td>" +
								"<td><span id='osasto_lyhenne_" +
								id +
								"'>" +
								replyObj[i].lyhenne +
								"</span></td>" +
								"<td><span id='osasto_nimi_" +
								id +
								"'>" +
								replyObj[i].nimi +
								"</span></td>" +
								"<td><span id='osasto_raporttinumero_" +
								id +
								"'>" +
								replyObj[i].raporttinumero +
								"</span></td>" +
								"<td><span id='osasto_toimialue_" +
								id +
								"'>" +
								replyObj[i].toimialue +
								"</span></td>" +
								"<td><span id='osasto_palvelualue_" +
								id +
								"'>" +
								replyObj[i].palvelualue +
								"</span></td>" +
								"<td class='sijaistila'><span id='osasto_si_s_kustannus_" +
								id +
								"'>" +
								replyObj[i].si_h_kustannus +
								"</span></td>" +
								"<td class='sijaistila'><span id='osasto_si_h_kustannus_" +
								id +
								"'>" +
								replyObj[i].si_s_kustannus +
								"</span></td>" +
								"<td class='reservitila'><span id='osasto_r_kustannus_" +
								id +
								"' >" +
								replyObj[i].r_kustannus +
								"</span></td>" +
								"<td class='sihteeritila'><span id='osasto_s_kustannus_" +
								id +
								"' >" +
								replyObj[i].s_kustannus +
								"</span></td>" +
								"</tr>";

							if (virhe) {
								$("#osastodata").prepend(osastodata);
							} else {
								$("#osastodata").append(osastodata);
							}

							$("#osasto_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_osastoTietoRuutu(
									$(this).prop("id").replace("osasto_rivi_", "")
								);
							});
						}

						if (hallinta_tila == "sijaistila") {
							$("#osastodata .reservitila").hide();
							$("#osastodata .sihteeritila").hide();
							$("#osastodata .sijaistila").show();
						} else if (hallinta_tila == "reservitila") {
							$("#osastodata .sijaistila").hide();
							$("#osastodata .sihteeritila").hide();
							$("#osastodata .reservitila").show();
						} else if (hallinta_tila == "sihteeritila") {
							$("#osastodata .sijaistila").hide();
							$("#osastodata .reservitila").hide();
							$("#osastodata .sihteeritila").show();
						}
				}
			}
		}
	);
}

function hallinta_hae_osasto_valinnat() {
	$("#osastosuodatin").html("<option value='0'>Kaikki</option>");
	$("#kustannusosasto").html("<option value='-1'>Valitse</option>");
	$("#reservikustannusosasto").html("<option value='-1'>Valitse</option>");

	$("#osastosuodatin").val(0);
	$("#kustannusosasto").val(-1);
	$("#reservikustannusosasto").val(-1);

	$.post(
		"php/hae_osasto_valinnat.php",
		{ jarjestys: "nimi" },
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				if (replyObj.length > 0) {
					for (let i = 0; i < replyObj.length; i++) {
						let aktiivinen = "";
						if (replyObj[i].aktiivinen == 0) {
							aktiivinen = " disabled";
						}
						if (replyObj[i].tulosalue_id != 0) {
							$("#osastosuodatin").append(
								"<option value='" +
									replyObj[i].id +
									"'" +
									aktiivinen +
									">" +
									"(" +
									replyObj[i].lyhenne +
									") " +
									replyObj[i].nimi +
									"</option>"
							);
							$("#reservikustannusosasto").append(
								"<option value='" +
									replyObj[i].id +
									"'" +
									aktiivinen +
									">" +
									"(" +
									replyObj[i].lyhenne +
									") " +
									replyObj[i].nimi +
									"</option>"
							);
						}

						$("#kustannusosasto").append(
							"<option value='" +
								replyObj[i].id +
								"'" +
								aktiivinen +
								">" +
								"(" +
								replyObj[i].lyhenne +
								") " +
								replyObj[i].nimi +
								"</option>"
						);
					}
				}
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function hallinta_nayta_osastoTietoRuutu(id) {
	$("#osastoid").html("");
	$("#osastolyhenne").val("");
	$("#osastonimi").val("");
	$("#osastoraporttinumero").val("");
	$("#osastotoimialue").val(-1);
	$("#osastopalvelualue").val(-1);
	$("#osastoTietoRuutu")
		.next(".ui-dialog-buttonpane")
		.find("button:contains('Poista')")
		.hide();
	$("#osastoTietoRuutu").dialog("option", "title", "Lisää osasto");
	$("#osastoaktiivinen_valinta").prop("checked", true);

	if (id != "") {
		$("#osastoid").html(id);
		$("#osastolyhenne").val($("#osasto_lyhenne_" + id).html());
		$("#osastonimi").val($("#osasto_nimi_" + id).html());
		$("#osastoraporttinumero").val($("#osasto_raporttinumero_" + id).html());
		$("#osastotoimialue").val($("#osasto_toimialue_id_" + id).html());
		$("#osastopalvelualue").val($("#osasto_palvelualue_id_" + id).html());
		$("#osastoTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#osastoTietoRuutu").dialog("option", "title", "Muokkaa osaston tietoja");

		if ($("#osasto_rivi_" + id).data("aktiivinen") == 0) {
			$("#osastoaktiivinen_valinta").prop("checked", false);
		}
	}

	$("#osastoTietoRuutu").dialog("open");
}

function hallinta_tallenna_osasto() {
	let o_id = $("#osastoid").html();
	let o_lyhenne = $("#osastolyhenne").val();
	let o_nimi = $("#osastonimi").val();
	let o_raporttinumero = $("#osastoraporttinumero").val();
	let o_toimialue_id = $("#osastotoimialue option:selected").val();
	let o_palvelualue_id = $("#osastopalvelualue option:selected").val();

	if (o_lyhenne == "" || o_nimi == "") {
		alert("Tarkista tiedot");
		return;
	}

	if (o_toimialue_id == -1) {
		alert("Valitse toimialue");
		return;
	}

	if (o_raporttinumero.length != 4) {
		alert("Tarkista raporttinumero (4 numeroa)");
		return;
	}

	let o_aktiivinen = 1;
	if ($("#osastoaktiivinen_valinta").prop("checked") == false) {
		o_aktiivinen = 0;
	}

	$.post(
		"php/tallenna_osasto.php",
		{
			id: o_id,
			lyhenne: o_lyhenne,
			nimi: o_nimi,
			raporttinumero: o_raporttinumero,
			toimialue_id: o_toimialue_id,
			palvelualue_id: o_palvelualue_id,
			aktiivinen: o_aktiivinen,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Osasto on jo olemassa annetulla lyhenteellä/kuvauksella");
						break;

					default:
						nayta_tilaviesti("Osaston lisäys/päivitys onnistui");
						hallinta_hae_osastot();
						hallinta_hae_osasto_valinnat();
						hallinta_hae_osasto_toimialue_valinnat();
						hallinta_nayta_sisalto("osastot", false);
						if (o_id == "") {
							$("#osastolyhenne").val("");
							$("#osastonimi").val("");
							$("#osastoraporttinumero").val("");
							$("#osastotoimialue").val(-1);
							$("#osastopalvelualue").val(-1);
							$("#osastoaktiivinen_valinta").prop("checked", true);
						} else {
							$("#osastoTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_osastoPoistoRuutu() {
	let id = $("#osastoid").html();
	$("#osastopoistoid").html(id);
	let teksti =
		"Haluatko poistaa osaston " + $("#osasto_nimi_" + id).html() + "?";
	$("#osastoPoistoRuutu").dialog("option", "title", teksti);
	$("#osastoPoistoRuutu").dialog("open");
}

function hallinta_poista_osasto() {
	let o_id = $("#osastopoistoid").html();

	if (o_id == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post("php/poista_osasto.php", { id: o_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			nayta_tilaviesti("Osaston poisto onnistui");
			$("#osastopoistoid").html("");
			hallinta_hae_osastot();
			hallinta_hae_osasto_valinnat();
			hallinta_nayta_sisalto("osastot", false);
			$("#osastoTietoRuutu").dialog("close");
			$("#osastoPoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_aseta_tyomaara_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == tyomaara_jarjestysarvo) {
		if (tyomaara_jarjestys == "DESC") {
			tyomaara_jarjestys = "ASC";
		} else {
			tyomaara_jarjestys = "DESC";
		}
	} else {
		tyomaara_jarjestysarvo = jarjestysarvo;
		tyomaara_jarjestys = "ASC";
	}

	hallinta_hae_tyomaarat();
}

function hallinta_hae_tyomaarat() {
	let haku_sana = "";
	if ($("#hakukohde option:selected").val() == "tyomaarat") {
		haku_sana = $("#hakukentta").val();
	}

	$.post(
		"php/hae_tyomaarat.php",
		{
			hakusana: haku_sana,
			jarjestys: tyomaara_jarjestys,
			jarjestettavaarvo: tyomaara_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "[]":
						$("#tyomaaradata").html("");
						$("#tyomaaradata").append(
							"<tr>" + "<td><span>Työmääriä ei löytynyt</span></td>" + "</tr>"
						);
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#tyomaaradata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let id = replyObj[i].id;

							$("#tyomaaradata").append(
								"<tr id='tyomaara_rivi_" +
									id +
									"'>" +
									"<td><span id='tyomaara_prosentti_" +
									id +
									"'>" +
									replyObj[i].prosentti +
									"</span></td>" +
									"</tr>"
							);

							$("#tyomaara_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_tyomaaraTietoRuutu(
									$(this).prop("id").replace("tyomaara_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_nayta_tyomaaraTietoRuutu(id) {
	if (id != "") {
		$("#tyomaaraid").html(id);
		$("#tyomaaraprosentti").val($("#tyomaara_prosentti_" + id).html());
		$("#tyomaaraTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#tyomaaraTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa työmäärä tietoja"
		);
	} else {
		$("#tyomaaraid").html("");
		$("#tyomaaraprosentti").val("");
		$("#tyomaaraTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.hide();
		$("#tyomaaraTietoRuutu").dialog("option", "title", "Lisää työmäärä");
	}

	$("#tyomaaraTietoRuutu").dialog("open");
}

function hallinta_tallenna_tyomaara() {
	let tj_id = $("#tyomaaraid").html();
	let tj_prosentti = $("#tyomaaraprosentti").val();

	if (tj_prosentti == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_tyomaara.php",
		{ id: tj_id, prosentti: tj_prosentti },
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Työmäärä on jo olemassa");
						break;

					default:
						nayta_tilaviesti("Työmäärän lisäys/päivitys onnistui");
						hallinta_hae_tyomaarat();
						hallinta_nayta_sisalto("tyomaarat", false);
						if (tj_id == "") {
							$("#tyomaaraprosentti").val("");
						} else {
							$("#tyomaaraTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_tyomaaraPoistoRuutu() {
	let id = $("#tyomaaraid").html();
	$("#tyomaarapoistoid").html(id);
	let teksti = "Haluatko poistaa työmäärän?";
	$("#tyomaaraPoistoRuutu").dialog("option", "title", teksti);
	$("#tyomaaraPoistoRuutu").dialog("open");
}

function hallinta_poista_tyomaara() {
	let tj_id = $("#tyomaarapoistoid").html();

	if (tj_id == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post("php/poista_tyomaara.php", { id: tj_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			nayta_tilaviesti("Työmäärän poisto onnistui");
			$("#tyomaarapoistoid").html("");
			hallinta_hae_tyomaarat();
			hallinta_nayta_sisalto("tyomaarat", false);
			$("#tyomaaraTietoRuutu").dialog("close");
			$("#tyomaaraPoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_aseta_kustannus_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == kustannus_jarjestysarvo) {
		if (kustannus_jarjestys == "DESC") {
			kustannus_jarjestys = "ASC";
		} else {
			kustannus_jarjestys = "DESC";
		}
	} else {
		kustannus_jarjestysarvo = jarjestysarvo;
		kustannus_jarjestys = "ASC";
	}

	hallinta_hae_kustannukset();
}

function hallinta_hae_kustannukset() {
	let haku_sana = "";
	if ($("#hakukohde option:selected").val() == "kustannukset") {
		haku_sana = $("#hakukentta").val();
	}

	let suodatin_kustannustyyppi = -1;
	if ($("#kustannuksetyyppisuodatin").val() != -1) {
		suodatin_kustannustyyppi = $("#kustannuksetyyppisuodatin").val();
	}

	$.post(
		"php/hae_kustannukset.php",
		{
			hakusana: haku_sana,
			kustannustyyppi: suodatin_kustannustyyppi,
			jarjestys: kustannus_jarjestys,
			jarjestettavaarvo: kustannus_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "[]":
						$("#kustannusdata").html("");
						$("#kustannusdata").append(
							"<tr>" +
								"<td colspan='5'><span>Kustannustietoja ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#kustannusdata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let virhe = false;
							let id = replyObj[i].id;

							let rivitila = "";
							if (replyObj[i].osasto == null) {
								rivitila = "class='tarkista_rivi'";
								virhe = true;
							}

							let kustannusdata =
								"<tr id='kustannus_rivi_" +
								id +
								"'" +
								rivitila +
								">" +
								"<td class='piilotettu'><span id='kustannus_osastoid_" +
								id +
								"'>" +
								replyObj[i].osasto_id +
								"</span></td>" +
								"<td><span id='kustannus_raporttinumero_" +
								id +
								"'>" +
								replyObj[i].raporttinumero +
								"</span></td>" +
								"<td><span id='kustannus_osasto_" +
								id +
								"'>" +
								replyObj[i].osasto +
								"</span></td>" +
								"<td><span id='kustannus_hinta_" +
								id +
								"'>" +
								replyObj[i].hinta +
								"</span></td>" +
								"<td><span id='kustannus_alkupvm_" +
								id +
								"'>" +
								replyObj[i].alku_pvm +
								"</span></td>" +
								"<td><span id='kustannus_loppupvm_" +
								id +
								"'>" +
								replyObj[i].loppu_pvm +
								"</span></td>" +
								"</tr>";

							if (virhe) {
								$("#kustannusdata").prepend(kustannusdata);
							} else {
								$("#kustannusdata").append(kustannusdata);
							}

							$("#kustannus_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_kustannusTietoRuutu(
									$(this).prop("id").replace("kustannus_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_nayta_kustannusTietoRuutu(id) {
	if (id != "") {
		$("#kustannusid").html(id);
		$("#kustannusosasto").val($("#kustannus_osastoid_" + id).html());
		$("#kustannushinta").val($("#kustannus_hinta_" + id).html());
		$("#kustannusalkupvm").val($("#kustannus_alkupvm_" + id).html());
		$("#kustannusloppupvm").val($("#kustannus_loppupvm_" + id).html());
		$("#kustannusalkupvm").datepicker(
			"option",
			"maxDate",
			$("#kustannus_loppupvm_" + id).html()
		);
		$("#kustannusloppupvm").datepicker(
			"option",
			"minDate",
			$("#kustannus_alkupvm_" + id).html()
		);
		$("#kustannusTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#kustannusTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa kustannus tietoja"
		);
	} else {
		$("#kustannusid").html("");
		$("#kustannusosasto").val(-1);
		$("#kustannushinta").val("");
		$("#kustannusalkupvm").val("");
		$("#kustannusloppupvm").val("");
		$("#kustannusalkupvm").datepicker("option", "maxDate", "");
		$("#kustannusloppupvm").datepicker("option", "minDate", "");
		$("#kustannusTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.hide();
		$("#kustannusTietoRuutu").dialog("option", "title", "Lisää kustannus");
	}

	$("#kustannusTietoRuutu").dialog("open");
}

function hallinta_tallenna_kustannus() {
	let ku_id = $("#kustannusid").html();
	let ku_osasto_id = $("#kustannusosasto option:selected").val();
	let ku_hinta = $("#kustannushinta").val();
	let ku_alku_pvm = $("#kustannusalkupvm").val();
	let ku_loppu_pvm = $("#kustannusloppupvm").val();

	ku_hinta = ku_hinta.replace(",", ".");

	if (
		ku_osasto_id == "-1" ||
		ku_hinta == "" ||
		ku_alku_pvm == "" ||
		ku_loppu_pvm == ""
	) {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_kustannus.php",
		{
			id: ku_id,
			osasto_id: ku_osasto_id,
			hinta: ku_hinta,
			alku_pvm: ku_alku_pvm,
			loppu_pvm: ku_loppu_pvm,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Osastolla on jo hinta valitulle ajalle");
						break;

					default:
						nayta_tilaviesti("Kustannuksen lisäys/päivitys onnistui");
						hallinta_hae_kustannukset();
						hallinta_nayta_sisalto("kustannukset", false);
						if (ku_id == "") {
							$("#kustannusosasto").val(-1);
							$("#kustannushinta").val("");
							$("#kustannusalkupvm").val("");
							$("#kustannusloppupvm").val("");
							$("#kustannusalkupvm").datepicker("option", "maxDate", "");
							$("#kustannusloppupvm").datepicker("option", "minDate", "");
						} else {
							$("#kustannusTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_kustannusPoistoRuutu() {
	let id = $("#kustannusid").html();
	$("#kustannuspoistoid").html(id);
	let teksti = "Haluatko poistaa kustannuksen?";
	$("#kustannusPoistoRuutu").dialog("option", "title", teksti);
	$("#kustannusPoistoRuutu").dialog("open");
}

function hallinta_poista_kustannus() {
	let ku_id = $("#kustannuspoistoid").html();

	if (ku_id == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post("php/poista_kustannus.php", { id: ku_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			nayta_tilaviesti("Kustannuksen poisto onnistui");
			$("#kustannuspoistoid").html("");
			hallinta_hae_kustannukset();
			hallinta_nayta_sisalto("kustannukset", false);
			$("#kustannusTietoRuutu").dialog("close");
			$("#kustannusPoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_aseta_henkilokustannus_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == henkilokustannus_jarjestysarvo) {
		if (henkilokustannus_jarjestys == "DESC") {
			henkilokustannus_jarjestys = "ASC";
		} else {
			henkilokustannus_jarjestys = "DESC";
		}
	} else {
		henkilokustannus_jarjestysarvo = jarjestysarvo;
		henkilokustannus_jarjestys = "ASC";
	}

	hallinta_hae_kustannukset();
}

function hallinta_hae_henkilokustannukset() {
	let haku_sana = "";
	if ($("#hakukohde option:selected").val() == "henkilokustannukset") {
		haku_sana = $("#hakukentta").val();
	}

	$.post(
		"php/hae_henkilokustannukset.php",
		{
			hakusana: haku_sana,
			jarjestys: henkilokustannus_jarjestys,
			jarjestettavaarvo: henkilokustannus_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "[]":
						$("#henkilokustannusdata").html("");
						$("#henkilokustannusdata").append(
							"<tr>" +
								"<td colspan='4'><span>Henkilokustannustietoja ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#henkilokustannusdata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let virhe = false;
							let id = replyObj[i].id;

							let rivitila = "";
							if (replyObj[i].sijainen == null) {
								rivitila = "class='tarkista_rivi'";
								virhe = true;
							}

							let henkilokustannusdata =
								"<tr id='henkilokustannus_rivi_" +
								id +
								"'" +
								rivitila +
								">" +
								"<td class='piilotettu'><span id='henkilokustannus_sijainen_id_" +
								id +
								"'>" +
								replyObj[i].sijainen_id +
								"</span></td>" +
								"<td><span id='henkilokustannus_sijainen_" +
								id +
								"'>" +
								replyObj[i].sijainen +
								"</span></td>" +
								"<td><span id='henkilokustannus_hinta_" +
								id +
								"'>" +
								replyObj[i].hinta +
								"</span></td>" +
								"<td><span id='henkilokustannus_alkupvm_" +
								id +
								"'>" +
								replyObj[i].alku_pvm +
								"</span></td>" +
								"<td><span id='henkilokustannus_loppupvm_" +
								id +
								"'>" +
								replyObj[i].loppu_pvm +
								"</span></td>" +
								"</tr>";

							if (virhe) {
								$("#henkilokustannusdata").prepend(henkilokustannusdata);
							} else {
								$("#henkilokustannusdata").append(henkilokustannusdata);
							}
							$("#henkilokustannus_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_henkilokustannusTietoRuutu(
									$(this).prop("id").replace("henkilokustannus_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_nayta_henkilokustannusTietoRuutu(id) {
	if (id != "") {
		$("#henkilokustannusid").html(id);
		$("#henkilokustannussijainen").val(
			$("#henkilokustannus_sijainen_id_" + id).html()
		);
		$("#henkilokustannushinta").val($("#henkilokustannus_hinta_" + id).html());
		$("#henkilokustannusalkupvm").val(
			$("#henkilokustannus_alkupvm_" + id).html()
		);
		$("#henkilokustannusloppupvm").val(
			$("#henkilokustannus_loppupvm_" + id).html()
		);
		$("#henkilokustannusalkupvm").datepicker(
			"option",
			"maxDate",
			$("#henkilokustannus_loppupvm_" + id).html()
		);
		$("#henkilokustannusloppupvm").datepicker(
			"option",
			"minDate",
			$("#henkilokustannus_alkupvm_" + id).html()
		);
		$("#henkilokustannusTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#henkilokustannusTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa henkilokustannus tietoja"
		);
	} else {
		$("#henkilokustannusid").html("");
		$("#henkilokustannussijainen").val(-1);
		$("#henkilokustannushinta").val("");
		$("#henkilokustannusalkupvm").val("");
		$("#henkilokustannusloppupvm").val("");
		$("#henkilokustannusalkupvm").datepicker("option", "maxDate", "");
		$("#henkilokustannusloppupvm").datepicker("option", "minDate", "");
		$("#henkilokustannusTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.hide();
		$("#henkilokustannusTietoRuutu").dialog(
			"option",
			"title",
			"Lisää henkilokustannus"
		);
	}

	$("#henkilokustannusTietoRuutu").dialog("open");
}

function hallinta_tallenna_henkilokustannus() {
	let heku_id = $("#henkilokustannusid").html();
	let heku_sijainen_id = $("#henkilokustannussijainen option:selected").val();
	let heku_hinta = $("#henkilokustannushinta").val();
	let heku_alku_pvm = $("#henkilokustannusalkupvm").val();
	let heku_loppu_pvm = $("#henkilokustannusloppupvm").val();

	heku_hinta = heku_hinta.replace(",", ".");

	if (
		heku_sijainen_id == "-1" ||
		heku_hinta == "" ||
		heku_alku_pvm == "" ||
		heku_loppu_pvm == ""
	) {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_henkilokustannus.php",
		{
			id: heku_id,
			sijainen_id: heku_sijainen_id,
			hinta: heku_hinta,
			alku_pvm: heku_alku_pvm,
			loppu_pvm: heku_loppu_pvm,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Sijaisella on jo hinta valitulle ajalle");
						break;

					default:
						nayta_tilaviesti("Henkilökustannuksen lisäys/päivitys onnistui");
						hallinta_hae_henkilokustannukset();
						hallinta_nayta_sisalto("henkilokustannukset", false);
						if (heku_id == "") {
							$("#henkilokustannussijainen").val(-1);
							$("#henkilokustannushinta").val("");
							$("#henkilokustannusalkupvm").val("");
							$("#henkilokustannusloppupvm").val("");
							$("#henkilokustannusalkupvm").datepicker("option", "maxDate", "");
							$("#henkilokustannusloppupvm").datepicker(
								"option",
								"minDate",
								""
							);
						} else {
							$("#henkilokustannusTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_henkilokustannusPoistoRuutu() {
	let id = $("#henkilokustannusid").html();
	$("#henkilokustannuspoistoid").html(id);
	let teksti = "Haluatko poistaa henkilökustannuksen?";
	$("#henkilokustannusPoistoRuutu").dialog("option", "title", teksti);
	$("#henkilokustannusPoistoRuutu").dialog("open");
}

function hallinta_poista_henkilokustannus() {
	let heku_id = $("#henkilokustannuspoistoid").html();

	if (heku_id == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post("php/poista_henkilokustannus.php", { id: heku_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			nayta_tilaviesti("Henkilökustannuksen poisto onnistui");
			$("#henkilokustannuspoistoid").html("");
			hallinta_hae_henkilokustannukset();
			hallinta_nayta_sisalto("henkilokustannukset", false);
			$("#henkilokustannusTietoRuutu").dialog("close");
			$("#henkilokustannusPoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_aseta_kilometrikustannus_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == kilometrikustannus_jarjestysarvo) {
		if (kilometrikustannus_jarjestys == "DESC") {
			kilometrikustannus_jarjestys = "ASC";
		} else {
			kilometrikustannus_jarjestys = "DESC";
		}
	} else {
		kilometrikustannus_jarjestysarvo = jarjestysarvo;
		kilometrikustannus_jarjestys = "ASC";
	}

	hallinta_hae_kilometrikustannukset();
}

function hallinta_hae_kilometrikustannukset() {
	let haku_sana = "";
	if ($("#hakukohde option:selected").val() == "kilometrikustannukset") {
		haku_sana = $("#hakukentta").val();
	}

	$.post(
		"php/hae_kilometrikustannukset.php",
		{
			hakusana: haku_sana,
			jarjestys: kilometrikustannus_jarjestys,
			jarjestettavaarvo: kilometrikustannus_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "[]":
						$("#kilometrikustannusdata").html(
							"<tr>" +
								"<td colspan='3'><span>kilometrikustannustietoja ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#kilometrikustannusdata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let id = replyObj[i].id;
							let tyyppi = "alle 5000 km";
							if (replyObj[i].tyyppi == 1) {
								tyyppi = "yli 5000 km";
							}
							let kilometrikustannusdata =
								"<tr id='kilometrikustannus_rivi_" +
								id +
								"' data-tyyppi='" +
								replyObj[i].tyyppi +
								"'>" +
								"<td><span id='kilometrikustannus_tyyppi_" +
								id +
								"'>" +
								tyyppi +
								"</span></td>" +
								"<td><span id='kilometrikustannus_hinta_" +
								id +
								"'>" +
								replyObj[i].hinta +
								"</span></td>" +
								"<td><span id='kilometrikustannus_alkupvm_" +
								id +
								"'>" +
								replyObj[i].alku_pvm +
								"</span></td>" +
								"<td><span id='kilometrikustannus_loppupvm_" +
								id +
								"'>" +
								replyObj[i].loppu_pvm +
								"</span></td>" +
								"</tr>";

							$("#kilometrikustannusdata").append(kilometrikustannusdata);

							$("#kilometrikustannus_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_kilometrikustannusTietoRuutu(
									$(this).prop("id").replace("kilometrikustannus_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_nayta_kilometrikustannusTietoRuutu(id) {
	if (id != "") {
		$("#kilometrikustannusid").html(id);
		$("#kilometrikustannustyyppi").val(
			$("#kilometrikustannus_rivi_" + id).data("tyyppi")
		);
		$("#kilometrikustannushinta").val(
			$("#kilometrikustannus_hinta_" + id).html()
		);
		$("#kilometrikustannusalkupvm").val(
			$("#kilometrikustannus_alkupvm_" + id).html()
		);
		$("#kilometrikustannusloppupvm").val(
			$("#kilometrikustannus_loppupvm_" + id).html()
		);
		$("#kilometrikustannusalkupvm").datepicker(
			"option",
			"maxDate",
			$("#kilometrikustannus_loppupvm_" + id).html()
		);
		$("#kilometrikustannusloppupvm").datepicker(
			"option",
			"minDate",
			$("#kilometrikustannus_alkupvm_" + id).html()
		);
		$("#kilometrikustannusTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#kilometrikustannusTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa kilometrikustannus tietoja"
		);
	} else {
		$("#kilometrikustannusid").html("");
		$("#kilometrikustannustyyppi").val(-1);
		$("#kilometrikustannushinta").val("");
		$("#kilometrikustannusalkupvm").val("");
		$("#kilometrikustannusloppupvm").val("");
		$("#kilometrikustannusalkupvm").datepicker("option", "maxDate", "");
		$("#kilometrikustannusloppupvm").datepicker("option", "minDate", "");
		$("#kilometrikustannusTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.hide();
		$("#kilometrikustannusTietoRuutu").dialog(
			"option",
			"title",
			"Lisää kilometrikustannus"
		);
	}

	$("#kilometrikustannusTietoRuutu").dialog("open");
}

function hallinta_tallenna_kilometrikustannus() {
	let kmku_id = $("#kilometrikustannusid").html();
	let kmku_tyyppi = $("#kilometrikustannustyyppi").val();
	let kmku_hinta = $("#kilometrikustannushinta").val();
	let kmku_alku_pvm = $("#kilometrikustannusalkupvm").val();
	let kmku_loppu_pvm = $("#kilometrikustannusloppupvm").val();

	kmku_hinta = kmku_hinta.replace(",", ".");

	if (
		kmku_tyyppi == -1 ||
		kmku_hinta == "" ||
		kmku_alku_pvm == "" ||
		kmku_loppu_pvm == ""
	) {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_kilometrikustannus.php",
		{
			id: kmku_id,
			tyyppi: kmku_tyyppi,
			hinta: kmku_hinta,
			alku_pvm: kmku_alku_pvm,
			loppu_pvm: kmku_loppu_pvm,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Valitulle ajanjaksolle on jo olemassa hinta");
						break;

					default:
						nayta_tilaviesti("Kilometrikustannuksen lisäys/päivitys onnistui");
						hallinta_hae_kilometrikustannukset();
						hallinta_nayta_sisalto("kilometrikustannukset", false);
						if (kmku_id == "") {
							$("#kilometrikustannustyyppi").val(-1);
							$("#kilometrikustannushinta").val("");
							$("#kilometrikustannusalkupvm").val("");
							$("#kilometrikustannusloppupvm").val("");
							$("#kilometrikustannusalkupvm").datepicker(
								"option",
								"maxDate",
								""
							);
							$("#kilometrikustannusloppupvm").datepicker(
								"option",
								"minDate",
								""
							);
						} else {
							$("#kilometrikustannusTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_kilometrikustannusPoistoRuutu() {
	let id = $("#kilometrikustannusid").html();
	$("#kilometrikustannuspoistoid").html(id);
	let teksti = "Haluatko poistaa kilometrikustannuksen?";
	$("#kilometrikustannusPoistoRuutu").dialog("option", "title", teksti);
	$("#kilometrikustannusPoistoRuutu").dialog("open");
}

function hallinta_poista_kilometrikustannus() {
	let kmku_id = $("#kilometrikustannuspoistoid").html();

	if (kmku_id == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/poista_kilometrikustannus.php",
		{ id: kmku_id },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				nayta_tilaviesti("Kilometrikustannuksen poisto onnistui");
				$("#kilometrikustannuspoistoid").html("");
				hallinta_hae_kilometrikustannukset();
				hallinta_nayta_sisalto("kilometrikustannukset", false);
				$("#kilometrikustannusTietoRuutu").dialog("close");
				$("#kilometrikustannusPoistoRuutu").dialog("close");
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function hallinta_aseta_reservikustannus_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == reservikustannus_jarjestysarvo) {
		if (reservikustannus_jarjestys == "DESC") {
			reservikustannus_jarjestys = "ASC";
		} else {
			reservikustannus_jarjestys = "DESC";
		}
	} else {
		reservikustannus_jarjestysarvo = jarjestysarvo;
		reservikustannus_jarjestys = "ASC";
	}

	hallinta_hae_reservikustannukset();
}

function hallinta_hae_reservikustannukset() {
	let haku_sana = "";
	if ($("#hakukohde option:selected").val() == "reservikustannukset") {
		haku_sana = $("#hakukentta").val();
	}

	$.post(
		"php/hae_reservikustannukset.php",
		{
			hakusana: haku_sana,
			jarjestys: reservikustannus_jarjestys,
			jarjestettavaarvo: reservikustannus_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "[]":
						$("#reservikustannusdata").html("");
						$("#reservikustannusdata").append(
							"<tr>" +
								"<td colspan='5'><span>Reservikustannustietoja ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#reservikustannusdata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let virhe = false;
							let id = replyObj[i].id;

							let rivitila = "";
							if (replyObj[i].osasto == null) {
								rivitila = "class='tarkista_rivi'";
								virhe = true;
							}

							let reservikustannusdata =
								"<tr id='reservikustannus_rivi_" +
								id +
								"'" +
								rivitila +
								">" +
								"<td class='piilotettu'><span id='reservikustannus_osastoid_" +
								id +
								"'>" +
								replyObj[i].osasto_id +
								"</span></td>" +
								"<td><span id='reservikustannus_raporttinumero_" +
								id +
								"'>" +
								replyObj[i].raporttinumero +
								"</td>" +
								"<td><span id='reservikustannus_osasto_" +
								id +
								"'>" +
								replyObj[i].osasto +
								"</span></td>" +
								"<td><span id='reservikustannus_hinta_" +
								id +
								"'>" +
								replyObj[i].hinta +
								"</span></td>" +
								"<td><span id='reservikustannus_alkupvm_" +
								id +
								"'>" +
								replyObj[i].alku_pvm +
								"</span></td>" +
								"<td><span id='reservikustannus_loppupvm_" +
								id +
								"'>" +
								replyObj[i].loppu_pvm +
								"</span></td>" +
								"</tr>";

							if (virhe) {
								$("#reservikustannusdata").prepend(reservikustannusdata);
							} else {
								$("#reservikustannusdata").append(reservikustannusdata);
							}
							$("#reservikustannus_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_reservikustannusTietoRuutu(
									$(this).prop("id").replace("reservikustannus_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_nayta_reservikustannusTietoRuutu(id) {
	if (id != "") {
		$("#reservikustannusid").html(id);
		$("#reservikustannusosasto").val(
			$("#reservikustannus_osastoid_" + id).html()
		);
		$("#reservikustannushinta").val($("#reservikustannus_hinta_" + id).html());
		$("#reservikustannusalkupvm").val(
			$("#reservikustannus_alkupvm_" + id).html()
		);
		$("#reservikustannusloppupvm").val(
			$("#reservikustannus_loppupvm_" + id).html()
		);
		$("#reservikustannusalkupvm").datepicker(
			"option",
			"maxDate",
			$("#reservikustannus_loppupvm_" + id).html()
		);
		$("#reservikustannusloppupvm").datepicker(
			"option",
			"minDate",
			$("#reservikustannus_alkupvm_" + id).html()
		);
		$("#reservikustannusTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#reservikustannusTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa reservikustannus tietoja"
		);
	} else {
		$("#reservikustannusid").html("");
		$("#reservikustannusosasto").val(-1);
		$("#reservikustannushinta").val("");
		$("#reservikustannusalkupvm").val("");
		$("#reservikustannusloppupvm").val("");
		$("#reservikustannusalkupvm").datepicker("option", "maxDate", "");
		$("#reservikustannusloppupvm").datepicker("option", "minDate", "");
		$("#reservikustannusTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.hide();
		$("#reservikustannusTietoRuutu").dialog(
			"option",
			"title",
			"Lisää reservikustannus"
		);
	}

	$("#reservikustannusTietoRuutu").dialog("open");
}

function hallinta_tallenna_reservikustannus() {
	let reku_id = $("#reservikustannusid").html();
	let reku_osasto_id = $("#reservikustannusosasto").val();
	let reku_hinta = $("#reservikustannushinta").val();
	let reku_alku_pvm = $("#reservikustannusalkupvm").val();
	let reku_loppu_pvm = $("#reservikustannusloppupvm").val();

	reku_hinta = reku_hinta.replace(",", ".");

	if (
		reku_osasto_id == "-1" ||
		reku_hinta == "" ||
		reku_alku_pvm == "" ||
		reku_loppu_pvm == ""
	) {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_reservikustannus.php",
		{
			id: reku_id,
			osasto_id: reku_osasto_id,
			hinta: reku_hinta,
			alku_pvm: reku_alku_pvm,
			loppu_pvm: reku_loppu_pvm,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Osastolla on jo hinta valitulle ajalle");
						break;

					default:
						nayta_tilaviesti("Reservikustannuksen lisäys/päivitys onnistui");
						hallinta_hae_reservikustannukset();
						hallinta_nayta_sisalto("reservikustannukset", false);
						if (reku_id == "") {
							$("#reservikustannusosasto").val(-1);
							$("#reservikustannushinta").val("");
							$("#reservikustannusalkupvm").val("");
							$("#reservikustannusloppupvm").val("");
							$("#reservikustannusalkupvm").datepicker("option", "maxDate", "");
							$("#reservikustannusloppupvm").datepicker(
								"option",
								"minDate",
								""
							);
						} else {
							$("#reservikustannusTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_reservikustannusPoistoRuutu() {
	let id = $("#reservikustannusid").html();
	$("#reservikustannuspoistoid").html(id);
	let teksti = "Haluatko poistaa reservikustannuksen?";
	$("#reservikustannusPoistoRuutu").dialog("option", "title", teksti);
	$("#reservikustannusPoistoRuutu").dialog("open");
}

function hallinta_poista_reservikustannus() {
	let reku_id = $("#reservikustannuspoistoid").html();

	if (reku_id == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post("php/poista_reservikustannus.php", { id: reku_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			nayta_tilaviesti("Reservikustannuksen poisto onnistui");
			$("#reservikustannuspoistoid").html("");
			hallinta_hae_reservikustannukset();
			hallinta_nayta_sisalto("reservikustannukset", false);
			$("#reservikustannusTietoRuutu").dialog("close");
			$("#reservikustannusPoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_aseta_reservihenkilokustannus_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == reservihenkilokustannus_jarjestysarvo) {
		if (reservihenkilokustannus_jarjestys == "DESC") {
			reservihenkilokustannus_jarjestys = "ASC";
		} else {
			reservihenkilokustannus_jarjestys = "DESC";
		}
	} else {
		reservihenkilokustannus_jarjestysarvo = jarjestysarvo;
		reservihenkilokustannus_jarjestys = "ASC";
	}

	hallinta_hae_reservihenkilokustannukset();
}

function hallinta_hae_reservihenkilokustannukset() {
	let haku_sana = "";
	if ($("#hakukohde option:selected").val() == "reservihenkilokustannukset") {
		haku_sana = $("#hakukentta").val();
	}

	$.post(
		"php/hae_reservihenkilokustannukset.php",
		{
			hakusana: haku_sana,
			jarjestys: reservihenkilokustannus_jarjestys,
			jarjestettavaarvo: reservihenkilokustannus_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "[]":
						$("#reservihenkilokustannusdata").html("");
						$("#reservihenkilokustannusdata").append(
							"<tr>" +
								"<td colspan='4'><span>Reservihenkilokustannustietoja ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#reservihenkilokustannusdata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let virhe = false;
							let id = replyObj[i].id;

							let rivitila = "";
							if (replyObj[i].reservilainen == null) {
								rivitila = "class='tarkista_rivi'";
								virhe = true;
							}

							let reservihenkilokustannusdata =
								"<tr id='reservihenkilokustannus_rivi_" +
								id +
								"'" +
								rivitila +
								">" +
								"<td class='piilotettu'><span id='reservihenkilokustannus_reservilainen_id_" +
								id +
								"'>" +
								replyObj[i].reservilainen_id +
								"</span></td>" +
								"<td><span id='reservihenkilokustannus_reservilainen_" +
								id +
								"'>" +
								replyObj[i].reservilainen +
								"</span></td>" +
								"<td><span id='reservihenkilokustannus_hinta_" +
								id +
								"'>" +
								replyObj[i].hinta +
								"</span></td>" +
								"<td><span id='reservihenkilokustannus_alkupvm_" +
								id +
								"'>" +
								replyObj[i].alku_pvm +
								"</span></td>" +
								"<td><span id='reservihenkilokustannus_loppupvm_" +
								id +
								"'>" +
								replyObj[i].loppu_pvm +
								"</span></td>" +
								"</tr>";

							if (virhe) {
								$("#reservihenkilokustannusdata").prepend(
									reservihenkilokustannusdata
								);
							} else {
								$("#reservihenkilokustannusdata").append(
									reservihenkilokustannusdata
								);
							}
							$("#reservihenkilokustannus_rivi_" + id).on(
								"dblclick",
								function () {
									hallinta_nayta_reservihenkilokustannusTietoRuutu(
										$(this)
											.prop("id")
											.replace("reservihenkilokustannus_rivi_", "")
									);
								}
							);
						}
				}
			}
		}
	);
}

function hallinta_nayta_reservihenkilokustannusTietoRuutu(id) {
	if (id != "") {
		$("#reservihenkilokustannusid").html(id);
		$("#reservihenkilokustannusreservilainen").val(
			$("#reservihenkilokustannus_reservilainen_id_" + id).html()
		);
		$("#reservihenkilokustannushinta").val(
			$("#reservihenkilokustannus_hinta_" + id).html()
		);
		$("#reservihenkilokustannusalkupvm").val(
			$("#reservihenkilokustannus_alkupvm_" + id).html()
		);
		$("#reservihenkilokustannusloppupvm").val(
			$("#reservihenkilokustannus_loppupvm_" + id).html()
		);
		$("#reservihenkilokustannusalkupvm").datepicker(
			"option",
			"maxDate",
			$("#reservihenkilokustannus_loppupvm_" + id).html()
		);
		$("#reservihenkilokustannusloppupvm").datepicker(
			"option",
			"minDate",
			$("#reservihenkilokustannus_alkupvm_" + id).html()
		);
		$("#reservihenkilokustannusTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#reservihenkilokustannusTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa reservihenkilokustannus tietoja"
		);
	} else {
		$("#reservihenkilokustannusid").html("");
		$("#reservihenkilokustannusreservilainen").val(-1);
		$("#reservihenkilokustannushinta").val("");
		$("#reservihenkilokustannusalkupvm").val("");
		$("#reservihenkilokustannusloppupvm").val("");
		$("#reservihenkilokustannusalkupvm").datepicker("option", "maxDate", "");
		$("#reservihenkilokustannusloppupvm").datepicker("option", "minDate", "");
		$("#reservihenkilokustannusTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.hide();
		$("#reservihenkilokustannusTietoRuutu").dialog(
			"option",
			"title",
			"Lisää reservihenkilokustannus"
		);
	}

	$("#reservihenkilokustannusTietoRuutu").dialog("open");
}

function hallinta_tallenna_reservihenkilokustannus() {
	let reheku_id = $("#reservihenkilokustannusid").html();
	let reheku_reservilainen_id = $(
		"#reservihenkilokustannusreservilainen"
	).val();
	let reheku_hinta = $("#reservihenkilokustannushinta").val();
	let reheku_alku_pvm = $("#reservihenkilokustannusalkupvm").val();
	let reheku_loppu_pvm = $("#reservihenkilokustannusloppupvm").val();

	reheku_hinta = reheku_hinta.replace(",", ".");

	if (
		reheku_reservilainen_id == "-1" ||
		reheku_hinta == "" ||
		reheku_alku_pvm == "" ||
		reheku_loppu_pvm == ""
	) {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_reservihenkilokustannus.php",
		{
			id: reheku_id,
			reservilainen_id: reheku_reservilainen_id,
			hinta: reheku_hinta,
			alku_pvm: reheku_alku_pvm,
			loppu_pvm: reheku_loppu_pvm,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Reserviläisellä on jo hinta valitulle ajalle");
						break;

					default:
						nayta_tilaviesti(
							"Reservihenkilökustannuksen lisäys/päivitys onnistui"
						);
						hallinta_hae_reservihenkilokustannukset();
						hallinta_nayta_sisalto("reservihenkilokustannukset", false);
						if (reheku_id == "") {
							$("#reservihenkilokustannusreservilainen").val(-1);
							$("#reservihenkilokustannushinta").val("");
							$("#reservihenkilokustannusalkupvm").val("");
							$("#reservihenkilokustannusloppupvm").val("");
							$("#reservihenkilokustannusalkupvm").datepicker(
								"option",
								"maxDate",
								""
							);
							$("#reservihenkilokustannusloppupvm").datepicker(
								"option",
								"minDate",
								""
							);
						} else {
							$("#reservihenkilokustannusTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_reservihenkilokustannusPoistoRuutu() {
	let id = $("#reservihenkilokustannusid").html();
	$("#reservihenkilokustannuspoistoid").html(id);
	let teksti = "Haluatko poistaa reservihenkilökustannuksen?";
	$("#reservihenkilokustannusPoistoRuutu").dialog("option", "title", teksti);
	$("#reservihenkilokustannusPoistoRuutu").dialog("open");
}

function hallinta_poista_reservihenkilokustannus() {
	let reheku_id = $("#reservihenkilokustannuspoistoid").html();

	if (reheku_id == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/poista_reservihenkilokustannus.php",
		{ id: reheku_id },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				nayta_tilaviesti("Reservihenkilökustannuksen poisto onnistui");
				$("#reservihenkilokustannuspoistoid").html("");
				hallinta_hae_reservihenkilokustannukset();
				hallinta_nayta_sisalto("reservihenkilokustannukset", false);
				$("#reservihenkilokustannusTietoRuutu").dialog("close");
				$("#reservihenkilokustannusPoistoRuutu").dialog("close");
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function hallinta_aseta_sihteerikustannus_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == sihteerikustannus_jarjestysarvo) {
		if (sihteerikustannus_jarjestys == "DESC") {
			sihteerikustannus_jarjestys = "ASC";
		} else {
			sihteerikustannus_jarjestys = "DESC";
		}
	} else {
		sihteerikustannus_jarjestysarvo = jarjestysarvo;
		sihteerikustannus_jarjestys = "ASC";
	}

	hallinta_hae_sihteerikustannukset();
}

function hallinta_hae_sihteerikustannukset() {
	let haku_sana = "";
	if ($("#hakukohde option:selected").val() == "sihteerikustannukset") {
		haku_sana = $("#hakukentta").val();
	}

	$.post(
		"php/hae_sihteerikustannukset.php",
		{
			hakusana: haku_sana,
			jarjestys: sihteerikustannus_jarjestys,
			jarjestettavaarvo: sihteerikustannus_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "[]":
						$("#sihteerikustannusdata").html("");
						$("#sihteerikustannusdata").append(
							"<tr>" +
								"<td colspan='3'><span>Sihteerikustannustietoja ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#sihteerikustannusdata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let id = replyObj[i].id;

							$("#sihteerikustannusdata").append(
								"<tr id='sihteerikustannus_rivi_" +
									id +
									"'>" +
									"<td><span id='sihteerikustannus_hinta_" +
									id +
									"'>" +
									replyObj[i].hinta +
									"</span></td>" +
									"<td><span id='sihteerikustannus_alkupvm_" +
									id +
									"'>" +
									replyObj[i].alku_pvm +
									"</span></td>" +
									"<td><span id='sihteerikustannus_loppupvm_" +
									id +
									"'>" +
									replyObj[i].loppu_pvm +
									"</span></td>" +
									"</tr>"
							);

							$("#sihteerikustannus_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_sihteerikustannusTietoRuutu(
									$(this).prop("id").replace("sihteerikustannus_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_nayta_sihteerikustannusTietoRuutu(id) {
	if (id != "") {
		$("#sihteerikustannusid").html(id);
		$("#sihteerikustannushinta").val(
			$("#sihteerikustannus_hinta_" + id).html()
		);
		$("#sihteerikustannusalkupvm").val(
			$("#sihteerikustannus_alkupvm_" + id).html()
		);
		$("#sihteerikustannusloppupvm").val(
			$("#sihteerikustannus_loppupvm_" + id).html()
		);
		$("#sihteerikustannusalkupvm").datepicker(
			"option",
			"maxDate",
			$("#sihteerikustannus_loppupvm_" + id).html()
		);
		$("#sihteerikustannusloppupvm").datepicker(
			"option",
			"minDate",
			$("#sihteerikustannus_alkupvm_" + id).html()
		);
		$("#sihteerikustannusTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#sihteerikustannusTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa sihteerikustannus tietoja"
		);
	} else {
		$("#sihteerikustannusid").html("");
		$("#sihteerikustannushinta").val("");
		$("#sihteerikustannusalkupvm").val("");
		$("#sihteerikustannusloppupvm").val("");
		$("#sihteerikustannusalkupvm").datepicker("option", "maxDate", "");
		$("#sihteerikustannusloppupvm").datepicker("option", "minDate", "");
		$("#sihteerikustannusTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.hide();
		$("#sihteerikustannusTietoRuutu").dialog(
			"option",
			"title",
			"Lisää sihteerikustannus"
		);
	}

	$("#sihteerikustannusTietoRuutu").dialog("open");
}

function hallinta_tallenna_sihteerikustannus() {
	let sihku_id = $("#sihteerikustannusid").html();
	let sihku_hinta = $("#sihteerikustannushinta").val();
	let sihku_alku_pvm = $("#sihteerikustannusalkupvm").val();
	let sihku_loppu_pvm = $("#sihteerikustannusloppupvm").val();

	sihku_hinta = sihku_hinta.replace(",", ".");

	if (sihku_hinta == "" || sihku_alku_pvm == "" || sihku_loppu_pvm == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_sihteerikustannus.php",
		{
			id: sihku_id,
			hinta: sihku_hinta,
			alku_pvm: sihku_alku_pvm,
			loppu_pvm: sihku_loppu_pvm,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Ajanjaksolle on jo hinta.");
						break;

					default:
						nayta_tilaviesti("Sihteerikustannuksen lisäys/päivitys onnistui");
						hallinta_hae_sihteerikustannukset();
						hallinta_nayta_sisalto("sihteerikustannukset", false);
						if (sihku_id == "") {
							$("#sihteerikustannushinta").val("");
							$("#sihteerikustannusalkupvm").val("");
							$("#sihteerikustannusloppupvm").val("");
							$("#sihteerikustannusalkupvm").datepicker(
								"option",
								"maxDate",
								""
							);
							$("#sihteerikustannusloppupvm").datepicker(
								"option",
								"minDate",
								""
							);
						} else {
							$("#sihteerikustannusTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_sihteerikustannusPoistoRuutu() {
	let id = $("#sihteerikustannusid").html();
	$("#sihteerikustannuspoistoid").html(id);
	let teksti = "Haluatko poistaa sihteerikustannuksen?";
	$("#sihteerikustannusPoistoRuutu").dialog("option", "title", teksti);
	$("#sihteerikustannusPoistoRuutu").dialog("open");
}

function hallinta_poista_sihteerikustannus() {
	let sihku_id = $("#sihteerikustannuspoistoid").html();

	if (sihku_id == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/poista_sihteerikustannus.php",
		{ id: sihku_id },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				nayta_tilaviesti("Sihteerikustannuksen poisto onnistui");
				$("#sihteerikustannuspoistoid").html("");
				hallinta_hae_sihteerikustannukset();
				hallinta_nayta_sisalto("sihteerikustannukset", false);
				$("#sihteerikustannusTietoRuutu").dialog("close");
				$("#sihteerikustannusPoistoRuutu").dialog("close");
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function hallinta_aseta_sijaisuustausta_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == sijaisuustausta_jarjestysarvo) {
		if (sijaisuustausta_jarjestys == "DESC") {
			sijaisuustausta_jarjestys = "ASC";
		} else {
			sijaisuustausta_jarjestys = "DESC";
		}
	} else {
		sijaisuustausta_jarjestysarvo = jarjestysarvo;
		sijaisuustausta_jarjestys = "ASC";
	}

	hallinta_hae_sijaisuustaustat();
}

function hallinta_hae_sijaisuustaustat() {
	let haku_sana = "";
	if ($("#hakukohde option:selected").val() == "sijaisuustaustat") {
		haku_sana = $("#hakukentta").val();
	}
	$.post(
		"php/hae_sijaisuustaustat.php",
		{
			hakusana: haku_sana,
			jarjestys: sijaisuustausta_jarjestys,
			jarjestettavaarvo: sijaisuustausta_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "[]":
						$("#sijaisuustaustadata").html("");
						$("#sijaisuustaustadata").append(
							"<tr>" +
								"<td colspan='2'><span>Sijaisuustaustoja ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#sijaisuustaustadata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let id = replyObj[i].id;
							$("#sijaisuustaustadata").append(
								"<tr id='sijaisuustausta_rivi_" +
									id +
									"'>" +
									"<td><span id='sijaisuustausta_selite_" +
									id +
									"'>" +
									replyObj[i].selite +
									"</span></td>" +
									"<td><span id='sijaisuustausta_numero_" +
									id +
									"'>" +
									replyObj[i].numero +
									"</span></td>" +
									"</tr>"
							);

							$("#sijaisuustausta_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_sijaisuustaustaTietoRuutu(
									$(this).prop("id").replace("sijaisuustausta_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_nayta_sijaisuustaustaTietoRuutu(id) {
	if (id != "") {
		$("#sijaisuustaustaid").html(id);
		$("#sijaisuustaustaselite").val($("#sijaisuustausta_selite_" + id).html());
		$("#sijaisuustaustanumero").val($("#sijaisuustausta_numero_" + id).html());
		$("#sijaisuustaustaTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#sijaisuustaustaTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa sijaisuustaustan tietoja"
		);
	} else {
		$("#sijaisuustaustaid").html("");
		$("#sijaisuustaustaselite").val("");
		$("#sijaisuustaustanumero").val("");
		$("#sijaisuustaustaTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.hide();
		$("#sijaisuustaustaTietoRuutu").dialog(
			"option",
			"title",
			"Lisää sijaisuustausta"
		);
	}
	$("#sijaisuustaustaTietoRuutu").dialog("open");
}

function hallinta_tallenna_sijaisuustausta() {
	let s_id = $("#sijaisuustaustaid").html();
	let s_selite = $("#sijaisuustaustaselite").val();
	let s_numero = $("#sijaisuustaustanumero").val();

	if (s_selite == "" || s_numero == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_sijaisuustausta.php",
		{ id: s_id, selite: s_selite, numero: s_numero },
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Sijaisuustausta on jo olemassa");
						break;

					default:
						nayta_tilaviesti("Sijaisuustaustan lisäys/päivitys onnistui");
						hallinta_hae_sijaisuustaustat();
						hallinta_nayta_sisalto("sijaisuustaustat", false);
						if (s_id == "") {
							$("#sijaisuustaustaselite").val("");
							$("#sijaisuustaustanumero").val("");
						} else {
							$("#sijaisuustaustaTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_sijaisuustaustaPoistoRuutu() {
	let id = $("#sijaisuustaustaid").html();
	$("#sijaisuustaustapoistoid").html(id);
	let teksti =
		"Haluatko poistaa sijaisuustaustan " +
		$("#sijaisuustausta_selite_" + id).html() +
		"?";
	$("#sijaisuustaustaPoistoRuutu").dialog("option", "title", teksti);
	$("#sijaisuustaustaPoistoRuutu").dialog("open");
}

function hallinta_poista_sijaisuustausta() {
	let s_id = $("#sijaisuustaustapoistoid").html();

	if (s_id == "") {
		alert("Id virhe");
		return;
	}

	$.post("php/poista_sijaisuustausta.php", { id: s_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			nayta_tilaviesti("Sijaisuustaustan poisto onnistui");
			$("#sijaisuustaustapoistoid").html("");
			hallinta_hae_sijaisuustaustat();
			hallinta_nayta_sisalto("sijaisuustaustat", false);
			$("#sijaisuustaustaTietoRuutu").dialog("close");
			$("#sijaisuustaustaPoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_aseta_reservitausta_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == reservitausta_jarjestysarvo) {
		if (reservitausta_jarjestys == "DESC") {
			reservitausta_jarjestys = "ASC";
		} else {
			reservitausta_jarjestys = "DESC";
		}
	} else {
		reservitausta_jarjestysarvo = jarjestysarvo;
		reservitausta_jarjestys = "ASC";
	}

	hallinta_hae_reservitaustat();
}

function hallinta_hae_reservitaustat() {
	let haku_sana = "";
	if ($("#hakukohde").val() == "reservitaustat") {
		haku_sana = $("#hakukentta").val();
	}
	$.post(
		"php/hae_reservitaustat.php",
		{
			hakusana: haku_sana,
			jarjestys: reservitausta_jarjestys,
			jarjestettavaarvo: reservitausta_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "[]":
						$("#reservitaustadata").html("");
						$("#reservitaustadata").append(
							"<tr>" +
								"<td colspan='2'><span>Reservitaustoja ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#reservitaustadata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let id = replyObj[i].id;
							$("#reservitaustadata").append(
								"<tr id='reservitausta_rivi_" +
									id +
									"'>" +
									"<td><span id='reservitausta_selite_" +
									id +
									"'>" +
									replyObj[i].selite +
									"</span></td>" +
									"<td><span id='reservitausta_numero_" +
									id +
									"'>" +
									replyObj[i].numero +
									"</span></td>" +
									"</tr>"
							);

							$("#reservitausta_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_reservitaustaTietoRuutu(
									$(this).prop("id").replace("reservitausta_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_nayta_reservitaustaTietoRuutu(id) {
	if (id != "") {
		$("#reservitaustaid").html(id);
		$("#reservitaustaselite").val($("#reservitausta_selite_" + id).html());
		$("#reservitaustanumero").val($("#reservitausta_numero_" + id).html());
		$("#reservitaustaTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		$("#reservitaustaTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa reservitaustan tietoja"
		);
	} else {
		$("#reservitaustaid").html("");
		$("#reservitaustaselite").val("");
		$("#reservitaustanumero").val("");
		$("#reservitaustaTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.hide();
		$("#reservitaustaTietoRuutu").dialog(
			"option",
			"title",
			"Lisää reservitausta"
		);
	}
	$("#reservitaustaTietoRuutu").dialog("open");
}

function hallinta_tallenna_reservitausta() {
	let r_id = $("#reservitaustaid").html();
	let r_selite = $("#reservitaustaselite").val();
	let r_numero = $("#reservitaustanumero").val();

	if (r_selite == "" || r_numero == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_reservitausta.php",
		{ id: r_id, selite: r_selite, numero: r_numero },
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa":
						alert("Reservitausta on jo olemassa");
						break;

					default:
						nayta_tilaviesti("Reservitaustan lisäys/päivitys onnistui");
						hallinta_hae_reservitaustat();
						hallinta_nayta_sisalto("reservitaustat", false);
						if (r_id == "") {
							$("#reservitaustaselite").val("");
							$("#reservitaustanumero").val("");
						} else {
							$("#reservitaustaTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_reservitaustaPoistoRuutu() {
	let id = $("#reservitaustaid").html();
	$("#reservitaustapoistoid").html(id);
	let teksti =
		"Haluatko poistaa reservitaustan " +
		$("#reservitausta_selite_" + id).html() +
		"?";
	$("#reservitaustaPoistoRuutu").dialog("option", "title", teksti);
	$("#reservitaustaPoistoRuutu").dialog("open");
}

function hallinta_poista_reservitausta() {
	let r_id = $("#reservitaustapoistoid").html();

	if (r_id == "") {
		alert("Id virhe");
		return;
	}

	$.post("php/poista_reservitausta.php", { id: r_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			nayta_tilaviesti("Reservitaustan poisto onnistui");
			$("#reservitaustapoistoid").html("");
			hallinta_hae_reservitaustat();
			hallinta_nayta_sisalto("reservitaustat", false);
			$("#reservitaustaTietoRuutu").dialog("close");
			$("#reservitaustaPoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_aseta_vuorotyypit_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == vuorotyypit_jarjestysarvo) {
		if (vuorotyypit_jarjestys == "DESC") {
			vuorotyypit_jarjestys = "ASC";
		} else {
			vuorotyypit_jarjestys = "DESC";
		}
	} else {
		vuorotyypit_jarjestysarvo = jarjestysarvo;
		vuorotyypit_jarjestys = "ASC";
	}

	hallinta_hae_vuorotyypit();
}

function hallinta_hae_vuorotyypit() {
	let haku_sana = "";
	if ($("#hakukohde option:selected").val() == "vuorotyypit") {
		haku_sana = $("#hakukentta").val();
	}
	$.post(
		"php/hae_vuorotyypit.php",
		{
			hakusana: haku_sana,
			jarjestys: vuorotyypit_jarjestys,
			jarjestettavaarvo: vuorotyypit_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "[]":
						$("#vuorotyyppidata").html("");
						$("#vuorotyyppidata").append(
							"<tr>" +
								"<td colspan='3'><span>Vuorotyyppejä ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#vuorotyyppidata").html("");
						$("#tulosTeksti").html("Rivit yhteensä: " + replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let id = replyObj[i].id;
							let vuoronakyvissa = "Kyllä";
							if (replyObj[i].vuoronakymassa == 0) {
								vuoronakyvissa = "Ei";
							}
							$("#vuorotyyppidata").append(
								"<tr id='vuorotyyppi_rivi_" +
									id +
									"'>" +
									"<td><span id='vuorotyyppi_kirjain_" +
									id +
									"'>" +
									replyObj[i].tyyppi +
									"</span></td>" +
									"<td><span id='vuorotyyppi_kuvaus_" +
									id +
									"'>" +
									replyObj[i].kuvaus +
									"</span></td>" +
									"<td><span id='vuorotyyppi_vari_" +
									id +
									"' class='vari_hex_esikatselu' style='background:" +
									replyObj[i].vari_hex +
									"; color:" +
									replyObj[i].vari_hex +
									"'>" +
									replyObj[i].vari_hex +
									"</span></td>" +
									"<td><span id='vuorotyyppi_vuoronakymassa_" +
									id +
									"'>" +
									vuoronakyvissa +
									"</span></td>" +
									"</tr>"
							);

							$("#vuorotyyppi_rivi_" + id).data(
								"vuoronakymassa",
								replyObj[i].vuoronakymassa
							);

							$("#vuorotyyppi_rivi_" + id).on("dblclick", function () {
								hallinta_nayta_vuoroTietoRuutu(
									$(this).prop("id").replace("vuorotyyppi_rivi_", "")
								);
							});
						}
				}
			}
		}
	);
}

function hallinta_nayta_vuoroTietoRuutu(id) {
	if (id != "") {
		$("#vuoroid").html(id);
		$("#vuorotyyppi").val($("#vuorotyyppi_kirjain_" + id).html());
		$("#vuorokuvaus").val($("#vuorotyyppi_kuvaus_" + id).html());
		let vuoronakyvissa = $("#vuorotyyppi_rivi_" + id).data("vuoronakymassa");
		if (vuoronakyvissa == 1) {
			$("#vuoronakyvissa").prop("checked", true);
		} else {
			$("#vuoronakyvissa").prop("checked", false);
		}
		$("#vuorotyyppiTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.show();
		let vari = $("#vuorotyyppi_vari_" + id).html();
		$("#vuorovari").css("background-color", vari);
		$("#vuorovari").data("vari", vari);
		$("#vuorotyyppiTietoRuutu").dialog(
			"option",
			"title",
			"Muokkaa vuorotyypin tietoja"
		);
	} else {
		$("#vuoroid").html("");
		$("#vuorotyyppi").val("");
		$("#vuorokuvaus").val("");
		$("#vuoronakyvissa").prop("checked", true);
		$("#vuorovari").css("background-color", "#ffffff");
		$("#vuorovari").data("vari", "#ffffff");
		$("#vuorotyyppiTietoRuutu").dialog("option", "title", "Lisää vuorotyyppi");
		$("#vuorotyyppiTietoRuutu")
			.next(".ui-dialog-buttonpane")
			.find("button:contains('Poista')")
			.hide();
	}
	$("#vuorotyyppiTietoRuutu").dialog("open");
}

function hallinta_tallenna_vuorotyyppi() {
	let v_id = $("#vuoroid").html();
	let v_tyyppi = $("#vuorotyyppi").val();
	let v_kuvaus = $("#vuorokuvaus").val();
	let v_vari_hex = $("#vuorovari").data("vari");
	let v_vuoronakymassa = 1;
	if ($("#vuoronakyvissa").prop("checked") == false) {
		v_vuoronakymassa = 0;
	}

	if (v_tyyppi == "" || v_kuvaus == "" || v_vari_hex == "") {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_vuorotyyppi.php",
		{
			id: v_id,
			tyyppi: v_tyyppi,
			kuvaus: v_kuvaus,
			vari_hex: v_vari_hex,
			vuoronakymassa: v_vuoronakymassa,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					case "olemassa-tyyppi":
						alert("Tyyppi on jo olemassa");
						break;

					case "olemassa-nappain":
						alert(
							"Tyyppi/Näppäin on käytössä vuorosuunnittelun vuoroyhdistelmissä"
						);
						break;

					default:
						nayta_tilaviesti("Vuoron lisäys/päivitys onnistui");
						hallinta_hae_vuorotyypit();
						hallinta_nayta_sisalto("vuorotyypit", false);
						if (v_id == "") {
							$("#vuorotyyppi").val("");
							$("#vuorokuvaus").val("");
							$("#vuoronakyvissa").prop("checked", true);
							$("#vuorovari").css("background-color", "#ffffff");
							$("#vuorovari").data("vari", "#ffffff");
						} else {
							$("#vuorotyyppiTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function hallinta_nayta_vuorotyyppiPoistoRuutu() {
	let id = $("#vuoroid").html();
	$("#vuoropoistoid").html(id);
	let teksti =
		"Haluatko poistaa vuorotyypin " +
		$("#vuorotyyppi_kirjain_" + id).html() +
		"?";
	$("#vuorotyyppiPoistoRuutu").dialog("option", "title", teksti);
	$("#vuorotyyppiPoistoRuutu").dialog("open");
}

function hallinta_poista_vuorotyyppi() {
	let v_id = $("#vuoropoistoid").html();

	if (v_id == "") {
		alert("Id virhe");
		return;
	}

	$.post("php/poista_vuorotyyppi.php", { id: v_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			if (replyObj[0].virhe == 0) {
				nayta_tilaviesti("Vuoron poisto onnistui");
				$("#vuoropoistoid").html("");
				hallinta_hae_vuorotyypit();
				hallinta_nayta_sisalto("vuorotyypit", false);
				$("#vuorotyyppiTietoRuutu").dialog("close");
				$("#vuorotyyppiPoistoRuutu").dialog("close");
			} else {
				nayta_tilaviesti("Vuoro on käytössä, sitä ei voi poistaa.");
				$("#vuorotyyppiPoistoRuutu").dialog("close");
			}
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function hallinta_muutaKirjainKoko() {
	$("#vuorotyyppi").val($("#vuorotyyppi").val().toUpperCase());
}

function hallinta_aseta_kustannustila(tila) {
	$("#hallinta_kustannustilakehys .painike_valittu_tila").removeClass(
		"painike_valittu_tila"
	);
	if (tila == "osasto") {
		if ($("#sijaistilapainike").hasClass("painike_valittu_tila")) {
			hallinta_nayta_sisalto("kustannukset", true);
		} else if ($("#reservitilapainike").hasClass("painike_valittu_tila")) {
			hallinta_nayta_sisalto("reservikustannukset", true);
		}

		$("#osastokustannustilapainike").addClass("painike_valittu_tila");
	} else if (tila == "henkilo") {
		/*
		if($('#sijaistilapainike').hasClass("painike_valittu_tila")) {
			hallinta_nayta_sisalto('henkilokustannukset',true);
		}
		*/
		if ($("#reservitilapainike").hasClass("painike_valittu_tila")) {
			hallinta_nayta_sisalto("reservihenkilokustannukset", true);
		}

		$("#henkilokustannustilapainike").addClass("painike_valittu_tila");
	} else if (tila == "kilometri") {
		if ($("#sijaistilapainike").hasClass("painike_valittu_tila")) {
			hallinta_nayta_sisalto("kilometrikustannukset", true);
		}
	}
}

function hallinta_aseta_tila(tila) {
	$(".sijaistila").hide();
	$(".reservitila").hide();
	$(".sihteeritila").hide();
	hallinta_tila = tila;

	$("#hallinta_tilakehys .painike_valittu_tila").removeClass(
		"painike_valittu_tila"
	);
	if (tila == "sijaistila") {
		$(".sijaistila").show();
		$("#sijaistilapainike").addClass("painike_valittu_tila");
	} else if (tila == "reservitila") {
		$(".reservitila").show();
		$("#reservitilapainike").addClass("painike_valittu_tila");
	} else if (tila == "sihteeritila") {
		$(".sihteeritila").show();
		$("#sihteeritilapainike").addClass("painike_valittu_tila");
	}

	hallinta_nayta_sisalto("kayttajat", true);
}

/******************* LOKI ************************************/
function alusta_loki() {
	if (!loki_alustettu) {
		$("#lokialkupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				$("#lokiloppupvm").datepicker("option", "minDate", pvm);

				if ($("#lokiloppupvm").val() == "") {
					let pvmtiedot = pvm.split(".");
					if (pvmtiedot.length == 3) {
						let kuukausi = parseInt(pvmtiedot[1]);
						let vuosi = pvmtiedot[2];
						let kuukausi_loppupvm = new Date(vuosi, kuukausi, 0, 0, 0, 0, 0);

						let kk_pvm =
							kuukausi_loppupvm.getDate() + "." + pvmtiedot[1] + "." + vuosi;
						$("#lokiloppupvm").val(kk_pvm);
					}
				}
			},
		});

		$("#lokiloppupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				$("#lokialkupvm").datepicker("option", "maxDate", pvm);
			},
		});

		$("#lokikalenteri").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			altField: "#lokialkupvm",
			inline: true,
			onSelect: function (pvm) {
				$("#lokikalenteri").hide();
				$("#lokiloppupvm").datepicker("option", "minDate", pvm);

				if ($("#lokiloppupvm").val() == "") {
					let pvmtiedot = pvm.split(".");
					if (pvmtiedot.length == 3) {
						let kuukausi = parseInt(pvmtiedot[1]);
						let vuosi = pvmtiedot[2];
						let kuukausi_loppupvm = new Date(vuosi, kuukausi, 0, 0, 0, 0, 0);

						let kk_pvm =
							kuukausi_loppupvm.getDate() + "." + pvmtiedot[1] + "." + vuosi;
						$("#lokiloppupvm").val(kk_pvm);
					}
				}
			},
		});

		$("#lokialkupvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#lokialkupvm"));
			}
		});

		$("#lokiloppupvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#lokiloppupvm"));
			}
		});

		$("#lokivalitsetapahtumat").change(function () {
			if ($("#lokivalitsetapahtumat").prop("checked")) {
				$("#lokitapahtumavalinnat")
					.find("input[type=checkbox]")
					.prop("checked", true);
				$("#lokitapahtumavalinnat")
					.find("div")
					.removeClass("valintakehys_valittu");
				$("#lokitapahtumavalinnat")
					.find("div")
					.addClass("valintakehys_valittu");
			} else {
				$("#lokitapahtumavalinnat")
					.find("input[type=checkbox]")
					.prop("checked", false);
				$("#lokitapahtumavalinnat")
					.find("div")
					.removeClass("valintakehys_valittu");
			}
		});

		$("#lokitunnistesuodatin").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 13) {
				loki_suodata_kirjaukset();
			}
		});

		$("#lokitietosuodatin").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 13) {
				loki_suodata_kirjaukset();
			}
		});

		$("#lokitunnistesuodatin").keyup(function () {
			let suodatinarvo = $("#lokitunnistesuodatin").val();

			if (suodatinarvo.length > 2) {
				$("#lokitunnistesuodatinValikko").html("");

				let hakutulokset = $.grep(loki_tunniste_suodatin, function (arvo, i) {
					return arvo.search(new RegExp(suodatinarvo, "i")) != -1;
				});

				let j = 0;
				for (lisattavaarvo in hakutulokset) {
					$("#lokitunnistesuodatinValikko").append(
						"<div id='lokitunnistesuodatin_rivi_" +
							j +
							"' class='suodatinvalintarivi'>" +
							hakutulokset[lisattavaarvo] +
							"</div>"
					);

					$("#lokitunnistesuodatin_rivi_" + j).click(function () {
						$("#lokitunnistesuodatin").val($(this).html());
						loki_suodata_kirjaukset();
					});

					j++;
				}

				$("#lokitunnistesuodatinValikko").show();
			} else {
				$("#lokitunnistesuodatinValikko").html("");
				$("#lokitunnistesuodatinValikko").hide();
			}
		});

		$("#lokitietosuodatin").keyup(function () {
			let suodatinarvo = $("#lokitietosuodatin").val();

			if (suodatinarvo.length > 2) {
				$("#lokitietosuodatinValikko").html("");

				let hakutulokset = $.grep(loki_tieto_suodatin, function (arvo, i) {
					return arvo.search(new RegExp(suodatinarvo, "i")) != -1;
				});

				let j = 0;
				for (lisattavaarvo in hakutulokset) {
					$("#lokitietosuodatinValikko").append(
						"<div id='lokitietosuodatin_rivi_" +
							j +
							"' class='suodatinvalintarivi'>" +
							hakutulokset[lisattavaarvo] +
							"</div>"
					);

					$("#lokitietosuodatin_rivi_" + j).click(function () {
						$("#lokitietosuodatin").val($(this).html());
						loki_suodata_kirjaukset();
					});

					j++;
				}

				$("#lokitietosuodatinValikko").show();
			} else {
				$("#lokitietosuodatinValikko").html("");
				$("#lokitietosuodatinValikko").hide();
			}
		});

		$("body,html").click(function (e) {
			$("#lokitietosuodatinValikko").hide();
			$("#lokitunnistesuodatinValikko").hide();
		});

		$("#lokikehys input").val("");
		$("#lokivalitsetapahtumat").prop("checked", false);

		loki_alustettu = true;
	}

	$(".suodatinkentta").val("");
	$(".suodatinvalikko").html("");
	$(".suodatinvalikko").hide();
	$("#lokivalitsetapahtumat").prop("checked", false);
	$("#lokitapahtumavalinnat").html("");
	$("#lokikirjausdata").html("");
	$("#lokikirjausrivimaara").html(0);
	$("#lokikirjausrivimaarayhteensa").html(0);
	$.datepicker._clearDate($("#lokialkupvm"));
	$.datepicker._clearDate($("#lokiloppupvm"));

	loki_hae_nakymavalinnat();
	loki_hae_kayttajavalinnat();
}

function loki_aseta_haku_nakyvyys() {
	if ($("#lokivalintaKehys").css("display") == "none") {
		$("#lokivalintaKehys").show("slide", { direction: "left" }, 500);
	} else {
		$("#lokivalintaKehys").hide("slide", { direction: "left" }, 500);
	}
}

function loki_hae_nakymavalinnat() {
	$("#lokinakymavalinta").html("<option value=''>Valitse</option>");
	const lokinakymat = ["Vuoronäkymä", "Vuorosuunnittelu"];

	for (let i = 0; i < lokinakymat.length; i++) {
		$("#lokinakymavalinta").append(
			"<option value='" + lokinakymat[i] + "'>" + lokinakymat[i] + "</option>"
		);
	}

	/*
	$.post("php/hae_loki_nakyma_valinnat.php", 
		function(reply) 
		{
			if(reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				for(let i = 0; i < replyObj.length; i++)
				{
					$('#lokinakymavalinta').append(
						"<option value='" + replyObj[i].nakyma + "'>" + replyObj[i].nakyma + "</option>"
					);
				}
			}
			else {
				alert("Tietokantavirhe");
			}
		}
	);
	*/
}

function loki_hae_tapahtumavalinnat() {
	if ($("#lokinakymavalinta").val() != "") {
		let l_nakyma = $("#lokinakymavalinta").val();
		$("#lokitapahtumavalinnat").html("");
		const lokitapahtumavalinnat = [
			"Lukitus",
			"Lukitus muutos",
			"Osasto muutos",
			"Raporttiosasto muutos",
			"Sijaisuustausta muutos",
			"Vuoro luotu",
			"Vuoro poistettu",
			"Vuoro päivitetty",
			"Vuorokommentti muutos",
		];

		let kaikkivalinta = "";
		let valittu = "";
		if ($("#lokivalitsetapahtumat").prop("checked") == true) {
			kaikkivalinta = " checked";
			valittu = " valintakehys_valittu";
		}
		for (let i = 0; i < lokitapahtumavalinnat.length; i++) {
			$("#lokitapahtumavalinnat").append(
				"<div id='lokitapahtumavalintakehys_" +
					i +
					"' class='valintakehys" +
					valittu +
					"' style='background-color:#ffffff'>" +
					"<input id='lokitapahtumavalinta_" +
					i +
					"' type='checkbox'" +
					kaikkivalinta +
					" />" +
					"<span id='lokitapahtumavalinta_teksti_" +
					i +
					"'>" +
					lokitapahtumavalinnat[i] +
					"</span>" +
					"</div>"
			);

			$("#lokitapahtumavalintakehys_" + i).click(function () {
				let id = $(this).prop("id").replace("lokitapahtumavalintakehys_", "");
				if ($("#lokitapahtumavalinta_" + id).prop("checked") == true) {
					$("#lokitapahtumavalinta_" + id).prop("checked", false);
					$("#lokivalitsetapahtumat").prop("checked", false);
					$(this).removeClass("valintakehys_valittu");
				} else {
					$("#lokitapahtumavalinta_" + id).prop("checked", true);
					$(this).addClass("valintakehys_valittu");
					if (
						$("#lokitapahtumavalinnat input:checked").length ==
						$("#lokitapahtumavalinnat input").length
					) {
						$("#lokivalitsetapahtumat").prop("checked", true);
					}
				}
			});

			$("#lokitapahtumavalinta_" + i).click(function (painiketapahtuma) {
				painiketapahtuma.stopPropagation();
				let id = $(this).prop("id").replace("lokitapahtumavalinta_", "");
				if ($(this).prop("checked") == false) {
					$("#lokivalitsetapahtumat").prop("checked", false);
					$("#lokitapahtumavalintakehys_" + id).removeClass(
						"valintakehys_valittu"
					);
				} else {
					$("#lokitapahtumavalintakehys_" + id).addClass(
						"valintakehys_valittu"
					);

					if (
						$("#lokitapahtumavalinnat input:checked").length ==
						$("#lokitapahtumavalinnat input").length
					) {
						$("#lokivalitsetapahtumat").prop("checked", true);
					}
				}
			});

			if (
				l_nakyma == "Vuoronäkymä" &&
				lokitapahtumavalinnat[i] == "Osasto muutos" &&
				$("#lokivalitsetapahtumat").prop("checked") == false
			) {
				$("#lokitapahtumavalinta_" + i).prop("checked", true);
				$("#lokitapahtumavalintakehys_" + i).addClass("valintakehys_valittu");
			}
		}
	}
	/*
  if ($("#lokinakymavalinta").val() != "") {
    let l_nakyma = $("#lokinakymavalinta").val();

    $.post("php/hae_loki_tapahtuma_valinnat.php", { nakyma: l_nakyma }, function (reply) {
      if (reply.indexOf("Tietokantavirhe:") == -1) {
        let replyObj = JSON.parse(reply);
        let kaikkivalinta = "";
        let valittu = "";
        if ($("#lokivalitsetapahtumat").prop("checked") == true) {
          kaikkivalinta = " checked";
          valittu = " valintakehys_valittu";
        }
        for (let i = 0; i < replyObj.length; i++) {
          $("#lokitapahtumavalinnat").append(
            "<div id='lokitapahtumavalintakehys_" +
              i +
              "' class='valintakehys" +
              valittu +
              "' style='background-color:#ffffff'>" +
              "<input id='lokitapahtumavalinta_" +
              i +
              "' type='checkbox'" +
              kaikkivalinta +
              " />" +
              "<span id='lokitapahtumavalinta_teksti_" +
              i +
              "'>" +
              replyObj[i].tapahtuma +
              "</span>" +
              "</div>"
          );

          $("#lokitapahtumavalintakehys_" + i).click(function () {
            let id = $(this).prop("id").replace("lokitapahtumavalintakehys_", "");
            if ($("#lokitapahtumavalinta_" + id).prop("checked") == true) {
              $("#lokitapahtumavalinta_" + id).prop("checked", false);
              $("#lokivalitsetapahtumat").prop("checked", false);
              $(this).removeClass("valintakehys_valittu");
            } else {
              $("#lokitapahtumavalinta_" + id).prop("checked", true);
              $(this).addClass("valintakehys_valittu");
              if ($("#lokitapahtumavalinnat input:checked").length == $("#lokitapahtumavalinnat input").length) {
                $("#lokivalitsetapahtumat").prop("checked", true);
              }
            }
          });

          $("#lokitapahtumavalinta_" + i).click(function (painiketapahtuma) {
            painiketapahtuma.stopPropagation();
            let id = $(this).prop("id").replace("lokitapahtumavalinta_", "");
            if ($(this).prop("checked") == false) {
              $("#lokivalitsetapahtumat").prop("checked", false);
              $("#lokitapahtumavalintakehys_" + id).removeClass("valintakehys_valittu");
            } else {
              $("#lokitapahtumavalintakehys_" + id).addClass("valintakehys_valittu");

              if ($("#lokitapahtumavalinnat input:checked").length == $("#lokitapahtumavalinnat input").length) {
                $("#lokivalitsetapahtumat").prop("checked", true);
              }
            }
          });

          if (l_nakyma == "Vuoronäkymä" && replyObj[i].tapahtuma == "Osasto muutos" && $("#lokivalitsetapahtumat").prop("checked") == false) {
            $("#lokitapahtumavalinta_" + i).prop("checked", true);
            $("#lokitapahtumavalintakehys_" + i).addClass("valintakehys_valittu");
          }
        }
      } else if (reply == "parametri") {
        alert("Parametrivirhe");
      } else {
        alert("Tietokantavirhe");
      }
    });
  }
  */
}

function loki_hae_kayttajavalinnat() {
	$("#lokikayttajavalinta").html("<option value=''>Kaikki</option>");

	$.post("php/hae_loki_kayttaja_valinnat.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			for (let i = 0; i < replyObj.length; i++) {
				$("#lokikayttajavalinta").append(
					"<option value='" +
						replyObj[i].kayttaja +
						"'>" +
						replyObj[i].kayttaja +
						"</option>"
				);
			}
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function loki_hae_kirjaukset() {
	let l_nakyma = "";
	let l_tapahtumat = "";
	let l_kayttajat = "";
	let l_alkupvm = "";
	let l_loppupvm = "";
	let l_tunnistehakusanat = "";
	let l_tietohakusanat = "";

	if ($("#lokinakymavalinta").val() != "") {
		l_nakyma = $("#lokinakymavalinta").val();
	}

	$("#lokitapahtumavalinnat input:checked").each(function () {
		let id = $(this).prop("id").replace("lokitapahtumavalinta_", "");
		l_tapahtumat += ",'" + $("#lokitapahtumavalinta_teksti_" + id).html() + "'";
	});

	if (l_tapahtumat.length > 0) {
		l_tapahtumat = l_tapahtumat.substr(1);
	} else {
		alert("Valitse yksi tai useampi tapahtuma");
		return;
	}

	l_kayttajat = $("#lokikayttajavalinta").val();
	l_alkupvm = $("#lokialkupvm").val();
	l_loppupvm = $("#lokiloppupvm").val();

	$("#lokikirjausdata").html("");
	loki_tunniste_suodatin = [];
	loki_tieto_suodatin = [];
	$("#lokitunnistesuodatin").val("");
	$("#lokitietosuodatin").val("");

	if (l_alkupvm == "" && loppu_pvm == "") {
		alert("Rajaa lokitapahtumat aikavälillä");
		return;
	}

	$.post(
		"php/hae_loki_kirjaukset.php",
		{
			nakyma: l_nakyma,
			tapahtumat: l_tapahtumat,
			kayttajat: l_kayttajat,
			alkupvm: l_alkupvm,
			loppupvm: l_loppupvm,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "[]":
						$("#lokikirjausdata").append(
							"<tr>" + "<td colspan='6'><span>Ei tietoja</span></td>" + "</tr>"
						);
						break;

					case "parametri":
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#lokikirjausrivimaara").html(replyObj[0]);
						$("#lokikirjausrivimaarayhteensa").html(replyObj[0]);
						for (let i = 1; i < replyObj.length; i++) {
							let id = replyObj[i].id;
							let tieto = replyObj[i].edellinen_tieto + " " + replyObj[i].tieto;
							$("#lokikirjausdata").append(
								"<tr id='lokikirjaus_rivi_" +
									id +
									"' class='lokikirjausrivi'>" +
									"<td><span id='lokikirjaus_aika_" +
									id +
									"'>" +
									replyObj[i].aika +
									"</span></td>" +
									"<td><span id='lokikirjaus_kayttaja_" +
									id +
									"'>" +
									replyObj[i].kayttaja +
									"</span></td>" +
									"<td><span id='lokikirjaus_tapahtuma_" +
									id +
									"'>" +
									replyObj[i].tapahtuma +
									"</span></td>" +
									"<td><span id='lokikirjaus_tunniste_" +
									id +
									"'>" +
									replyObj[i].tunniste +
									"</span></td>" +
									"<td class='lokikirjaus_ed_tieto'><span>" +
									replyObj[i].edellinen_tieto +
									"</span></td>" +
									"<td class='lokikirjaus_tieto'><span>" +
									replyObj[i].tieto +
									"</span></td>" +
									"<td class='piilotettu'><span id='lokikirjaus_tieto_" +
									id +
									"'>" +
									tieto +
									"</span></td>" +
									"</tr>"
							);

							if (loki_tunniste_suodatin.indexOf(replyObj[i].tunniste) == -1) {
								loki_tunniste_suodatin.push(replyObj[i].tunniste);
							}

							if (loki_tieto_suodatin.indexOf(tieto) == -1) {
								loki_tieto_suodatin.push(tieto);
							}
						}

						loki_tunniste_suodatin.sort();
						loki_tieto_suodatin.sort();

						if ($("#lokivalintaKehys").css("display") != "none") {
							$("#lokivalintaKehys").hide("slide", { direction: "left" }, 500);
						}
				}
			}
		}
	);
}

function loki_suodata_kirjaukset() {
	$(".suodatinvalikko").hide();
	let suodatetut_rivit = 0;
	let tunniste_suodatin_arvo = $("#lokitunnistesuodatin").val();
	let tieto_suodatin_arvo = $("#lokitietosuodatin").val();

	$(".lokikirjausrivi").each(function () {
		let id = $(this).prop("id").replace("lokikirjaus_rivi_", "");
		let tunniste_arvo = $("#lokikirjaus_tunniste_" + id).html();
		let tieto_arvo = $("#lokikirjaus_tieto_" + id).html();
		if (
			tunniste_arvo.search(new RegExp(tunniste_suodatin_arvo, "i")) != -1 &&
			tieto_arvo.search(new RegExp(tieto_suodatin_arvo, "i")) != -1
		) {
			$(this).show();
			suodatetut_rivit++;
		} else {
			$(this).hide();
		}
	});

	$("#lokikirjausrivimaara").html(suodatetut_rivit);
}

/******************* RAPORTOINTI **********************************/
function alusta_raportointi() {
	if (!raportointi_alustettu) {
		$("#raportointiRuutu").dialog({
			autoOpen: false,
			modal: true,
			title: "Raportin luonti",
			width: 650,
			buttons: [
				{
					class: "oikeapainike",
					text: "Luo raportti",
					click: function () {
						raportointi_luo_raportti();
					},
				},
				{
					class: "vasenpainike",
					text: "Peruuta",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		$("#raportointiladattavatsiirtotiedostotRuutu").dialog({
			autoOpen: false,
			title: "Siirtotiedostojen lataus",
			width: "auto",
			height: "auto",
			modal: true,
			buttons: [
				{
					class: "keskipainike",
					text: "Sulje",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		$("#raportointisiirtotiedostoruutu").dialog({
			autoOpen: false,
			modal: true,
			title: "Siirtotiedoston luonti",
			width: 650,
			buttons: [
				{
					class: "oikeapainike",
					text: "Luo siirtotiedosto",
					click: function () {
						raportointi_nayta_siirtotiedosto_varmistus_ruutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Peruuta",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		$("#raportointisiirtotiedostovarmistusRuutu").dialog({
			autoOpen: false,
			title: "Siirtotiedoston luonti",
			width: "auto",
			height: "auto",
			modal: true,
			closeOnEscape: false,
			dialogClass: "ei_sulku_painiketta",
			buttons: [
				{
					class: "vasenpainike",
					text: "Peruuta",
					click: function () {
						$(this).dialog("close");
					},
				},
				{
					class: "oikeapainike",
					text: "Ok",
					click: function () {
						raportointi_luo_tiedosto();
					},
				},
			],
		});

		//Aseta pvm_kentta tyhjennys del (46) tai backspace (8) näppäimestä
		$("#raportointialkupvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#raportointialkupvm"));
			}
		});

		//Aseta pvm_kentta tyhjennys del (46) tai backspace (8) näppäimestä
		$("#raportointiloppupvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#raportointiloppupvm"));
			}
		});

		$("#raportointialkupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				if (pvm) {
					$("#raportointiloppupvm").datepicker("option", "minDate", pvm);
				}
				raportointi_hae_osastot();
			},
		});

		$("#raportointiloppupvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (pvm) {
				if (pvm) {
					$("#raportointialkupvm").datepicker("option", "maxDate", pvm);
				}
				raportointi_hae_osastot();
			},
		});

		$("#raportointivuosikuukausi").datepicker({
			dateFormat: "yy-mm",
			regional: "fi",
			showOtherMonths: false,
			numberOfMonths: 1,
			showWeek: false,
			maxDate: new Date(),
			onChangeMonthYear: function (vuosi, kuukausi) {
				$(this).datepicker("setDate", new Date(vuosi, kuukausi - 1, 1));
			},
		});

		$("#raportointisiirtotiedostovuosikuukausi").datepicker({
			dateFormat: "yy-mm",
			regional: "fi",
			showOtherMonths: false,
			numberOfMonths: 1,
			showWeek: false,
			//minDate: "-1m",
			maxDate: new Date(),
			onChangeMonthYear: function (vuosi, kuukausi) {
				$(this).datepicker("setDate", new Date(vuosi, kuukausi - 1, 1));
			},
		});

		$("#raportointivalitseosastot").change(function () {
			if ($("#raportointivalitseosastot").prop("checked")) {
				$("#raportointiosastovalinnat")
					.find("input[type=checkbox]")
					.prop("checked", true);
			} else {
				$("#raportointiosastovalinnat")
					.find("input[type=checkbox]")
					.prop("checked", false);
			}
		});

		$("#raportointivalitsetaustat").change(function () {
			if ($("#raportointivalitsetaustat").prop("checked")) {
				$("#raportointitaustavalinnat")
					.find("input[type=checkbox]")
					.prop("checked", true);
			} else {
				$("#raportointitaustavalinnat")
					.find("input[type=checkbox]")
					.prop("checked", false);
			}
		});

		$("#raportointivalitsealueet").change(function () {
			if ($("#raportointivalitsealueet").prop("checked")) {
				$("#raportointialuevalinnat")
					.find("input[type=checkbox]")
					.prop("checked", true);
				raportointi_hae_osastot();
				raportointi_hae_henkilot();
			} else {
				$("#raportointialuevalinnat")
					.find("input[type=checkbox]")
					.prop("checked", false);
				$("#raportointiosastovalinnat").html("");
				$("#raportointihenkilovalinnat").html("");
			}
		});

		$("#raportointivalitsehenkilot").change(function () {
			if ($("#raportointivalitsehenkilot").prop("checked")) {
				$("#raportointihenkilovalinnat")
					.find("input[type=checkbox]")
					.prop("checked", true);
			} else {
				$("#raportointihenkilovalinnat")
					.find("input[type=checkbox]")
					.prop("checked", false);
			}
		});

		raportointi_alustettu = true;
	}

	$("#raportointiraporttivalinta").val(-1);
	$.datepicker._clearDate($("#raportointialkupvm"));
	$.datepicker._clearDate($("#raportointiloppupvm"));
	$("#raportointihenkilostovalinta").val(-1);
	$(".raportointisijaisvalinta").prop("disabled", true);
	$(".raportointireservivalinta").prop("disabled", true);
	$(".raportointisihteerivalinta").prop("disabled", true);
	$("#raportointivalitsealueet").prop("checked", false);
	$("#raportointivalitsetaustat").prop("checked", false);
	$("#raportointivalitseosastot").prop("checked", false);
	$("#raportointivalitsehenkilot").prop("checked", false);
	$("#raportointityhjavalinta").prop("checked", false);
	$("#raportointialuevalinnat").html("");
	$("#raportointitaustavalinnat").html("");
	$("#raportointiosastovalinnat").html("");
	$("#raportointihenkilovalinnat").html("");
	$("#raportointialueTeksti").html("");
	$("#raportointitaustaTeksti").html("");
	$(".raportointi_valintakehys").hide();
	$(".raporttikentta").val("");
	$(".jarjestelmaraporttikentta").val("");
	$("#raportointilatauskuva").hide();
	$("#raportointiosastojarjestysvalinta").val("toimialue-raporttinumero");
	$("#raportointihenkiloarjestysvalinta").val("nimi");
	$("#raportointiaikavaliKehys").hide();
	$("#raportointivuosikuukausi").show();
	$("#raportointivuosikuukausi").datepicker("setDate", new Date());
	$("#raportointivalinnatKehys").hide();
	raportointi_kuukausi_tila = true;
}

function raportointi_aseta_raportti_tyyppi() {
	const raporttivalinta = $("#raportointiraporttivalinta").val();
	$("#raportointihenkilostovalinta").val(-1);
	$(".raportointisijaisvalinta").prop("disabled", true);
	$(".raportointireservivalinta").prop("disabled", true);
	$(".raportointisihteerivalinta").prop("disabled", true);
	$("#raportointialueKehys").show();
	$("#raportointihenkiloKehys").show();
	$("#raportointitaustaKehys").show();
	$("#raportointiosastoKehys").show();
	$(".raportointi_valintakehys input").prop("disabled", false);

	if (raporttivalinta == 12 || raporttivalinta == -1) {
		$("#raportointi_valintanakyma").hide();
		$("#raportointivalinnatKehys").hide();
	} else {
		$("#raportointi_valintanakyma").show();
		$("#raportointivalinnatKehys").show();
	}

	if (
		raporttivalinta == 0 ||
		raporttivalinta == 1 ||
		raporttivalinta == 2 ||
		raporttivalinta == 11
	) {
		$(".raportointisijaisvalinta").prop("disabled", false);

		$("#raportointialueTeksti").html("Toimialueet");
		$("#raportointiosastojarjestysvalinta").val("toimialue-raporttinumero");
		$("#raportointihenkiloarjestysvalinta").val("nimi");
		$("#raportointitaustaTeksti").html("Sijaisuustaustat");
	} else if (
		raporttivalinta == 3 ||
		raporttivalinta == 4 ||
		raporttivalinta == 5
	) {
		$(".raportointireservivalinta").prop("disabled", false);

		$("#raportointialueTeksti").html("Toimialueet");
		$("#raportointiosastojarjestysvalinta").val("toimialue-raporttinumero");
		$("#raportointihenkiloarjestysvalinta").val("nimi");
		$("#raportointitaustaTeksti").html("Reservitaustat");
	} else if (raporttivalinta == 6 || raporttivalinta == 7) {
		$(".raportointisihteerivalinta").prop("disabled", false);

		$("#raportointialueTeksti").html("Palvelualueet");
		$("#raportointiosastojarjestysvalinta").val("palvelualue-raporttinumero");
		$("#raportointihenkiloarjestysvalinta").val("nimi");
		$("#raportointitaustaTeksti").html("Sijaisuustaustat");
	}

	raportointi_hae_alueet();
	raportointi_hae_taustat();
	raportointi_hae_osastot();
	raportointi_hae_henkilot();
}

function raportointi_vaihda_aikavali_tilaa() {
	if (!raportointi_kuukausi_tila) {
		$("#raportointiaikavaliKehys").hide();
		$("#raportointivuosikuukausi").show();
		$("#raportointivuosikuukausi").datepicker("setDate", new Date());
		raportointi_kuukausi_tila = true;
	} else {
		$("#raportointivuosikuukausi").hide();
		$("#raportointiaikavaliKehys").show();

		$("#raportointialkupvm").val("");
		$("#raportointiloppupvm").val("");
		raportointi_kuukausi_tila = false;
	}
}

function raportointi_henkiloston_vaihto() {
	raportointi_hae_osastot();
	raportointi_hae_henkilot();
}

function raportointi_hae_alueet() {
	$("#raportointialuevalinnat").html("");
	const raporttityyppi = $("#raportointiraporttivalinta").val();
	if (raporttityyppi == -1) {
		return;
	}

	let alue_idt = "";
	if (raporttityyppi < 6 || raporttityyppi == 11) {
		alue_idt = kayttaja_toimialue_idt;
	} else {
		alue_idt = -1;
	}

	$.post(
		"php/hae_raportti_alue_valinnat.php",
		{ raporttityyppi, alue_idt },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);

				for (let i = 0; i < replyObj.length; i++) {
					$("#raportointialuevalinnat").append(
						"<div id='raportointialuevalintakehys_" +
							replyObj[i].id +
							"' class='valintakehys' style='background-color:" +
							replyObj[i].taustavari +
							"'>" +
							"<input id='raportointialuevalinta_" +
							replyObj[i].id +
							"' type='checkbox' value='" +
							replyObj[i].id +
							"' />" +
							"<span id='raportointialuevalintaTeksti_" +
							replyObj[i].id +
							"' class='raportointialuevalintaTeksti'>" +
							replyObj[i].nimi +
							"</span>" +
							"</div>"
					);

					$("#raportointialuevalintakehys_" + replyObj[i].id).click(
						function () {
							let id = $(this)
								.prop("id")
								.replace("raportointialuevalintakehys_", "");
							if ($("#raportointialuevalinta_" + id).prop("checked") == true) {
								$("#raportointialuevalinta_" + id).prop("checked", false);
								$("#raportointivalitsealueet").prop("checked", false);
							} else {
								$("#raportointialuevalinta_" + id).prop("checked", true);
								if (
									$("#raportointialuevalinnat input:checked").length ==
									$("#raportointialuevalinnat input").length
								) {
									$("#raportointivalitsealueet").prop("checked", true);
								}
							}
							raportointi_hae_osastot();
							raportointi_hae_henkilot();
						}
					);

					$("#raportointialuevalinta_" + replyObj[i].id).click(function (
						painiketapahtuma
					) {
						painiketapahtuma.stopPropagation();
						raportointi_hae_osastot();
						raportointi_hae_henkilot();

						if ($(this).prop("checked") == false) {
							$("#raportointivalitsealueet").prop("checked", false);
						} else if (
							$("#raportointialuevalinnat input:checked").length ==
							$("#raportointialuevalinnat input").length
						) {
							$("#raportointivalitsealueet").prop("checked", true);
						}
					});
				}

				if ($("#raportointivalitsealueet").prop("checked") == true) {
					$("#raportointialuevalinnat input").prop("checked", true);
					raportointi_hae_osastot();
					raportointi_hae_henkilot();
				}
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function raportointi_hae_taustat() {
	$("#raportointitaustavalinnat").html("");
	const raporttityyppi = $("#raportointiraporttivalinta").val();
	if (raporttityyppi == -1) {
		return;
	}
	$.post(
		"php/hae_raportti_tausta_valinnat.php",
		{ raporttityyppi },
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				let isDisabled = " disabled";
				$("#raportointivalitsetaustat").prop("disabled", true);
				if (raporttityyppi == 0 || raporttityyppi == 3 || raporttityyppi == 6) {
					$("#raportointivalitsetaustat").prop("disabled", false);
					isDisabled = "";
				}

				for (let i = 0; i < replyObj.length; i++) {
					if (raporttityyppi == 2) {
						const osastonimi = replyObj[i].nimi.toLowerCase();
						if (!osastonimi.includes("kotiosasto")) {
							continue;
						}
					}
					$("#raportointitaustavalinnat").append(
						"<div id='raportointitaustavalintakehys_" +
							i +
							"' class='valintakehys'>" +
							"<input id='raportointitaustavalinta_" +
							i +
							"' type='checkbox' value='" +
							replyObj[i].id +
							"' checked" +
							isDisabled +
							" />" +
							"<span>" +
							replyObj[i].nimi +
							"</span>" +
							"</div>"
					);

					if (isDisabled == "") {
						$("#raportointitaustavalintakehys_" + i).click(function () {
							let id = $(this)
								.prop("id")
								.replace("raportointitaustavalintakehys_", "");
							if (
								$("#raportointitaustavalinta_" + id).prop("checked") == true
							) {
								$("#raportointitaustavalinta_" + id).prop("checked", false);
								$("#raportointivalitsetaustat").prop("checked", false);
							} else {
								$("#raportointitaustavalinta_" + id).prop("checked", true);
								if (
									$("#raportointitaustavalinnat input:checked").length ==
									$("#raportointitaustavalinnat input").length
								) {
									$("#raportointivalitsetaustat").prop("checked", true);
								}
							}
						});
					}

					$("#raportointitaustavalinta_" + i).click(function (
						painiketapahtuma
					) {
						painiketapahtuma.stopPropagation();
						let id = $(this)
							.prop("id")
							.replace("raportointitaustavalinta_", "");
						if ($(this).prop("checked") == false) {
							$("#raportointivalitsetaustat").prop("checked", false);
						} else {
							if (
								$("#raportointitaustavalinnat input:checked").length ==
								$("#raportointitaustavalinnat input").length
							) {
								$("#raportointivalitsetaustat").prop("checked", true);
							}
						}
					});
				}

				$("#raportointivalitsetaustat").prop("checked", true);
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function raportointi_hae_osastot() {
	$("#raportointiosastovalinnat").html("");

	let raportti_alue_idt = "";
	let jarjestysvalinta = $("#raportointiosastojarjestysvalinta").val();
	let r_alkupvm = $("#raportointialkupvm").val();
	let r_loppupvm = $("#raportointiloppupvm").val();
	let r_henkilosto = $("#raportointihenkilostovalinta").val();
	let r_tyyppi = $("#raportointiraporttivalinta").val();

	if (
		$("#raportointiraporttivalinta").val() < 6 ||
		$("#raportointiraporttivalinta").val() == 11
	) {
		$("#raportointialuevalinnat input:checked").each(function () {
			raportti_alue_idt += ",'" + this.value + "'";
		});
	} else {
		$("#raportointialuevalinnat input:checked").each(function () {
			raportti_alue_idt += ",'" + this.value + "'";
		});
	}

	if (raportti_alue_idt.length > 0) {
		raportti_alue_idt = raportti_alue_idt.substr(1);
	}

	if (raportti_alue_idt == "") {
		return;
	}

	$.post(
		"php/hae_raportti_osasto_valinnat.php",
		{
			alue_idt: raportti_alue_idt,
			jarjestys: jarjestysvalinta,
			alkupvm: r_alkupvm,
			loppupvm: r_loppupvm,
			henkilosto: r_henkilosto,
			tyyppi: r_tyyppi,
		},
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);

				let isDisabled = "";
				$("#raportointivalitseosastot").prop("disabled", false);
				if (r_tyyppi == 2 || r_tyyppi == 5 || r_tyyppi == 7) {
					isDisabled = " disabled";
					$("#raportointivalitseosastot").prop("disabled", true);
				}

				for (let i = 0; i < replyObj.length; i++) {
					let hinta = "";
					if (
						r_tyyppi == 0 ||
						r_tyyppi == 3 ||
						r_tyyppi == 6 ||
						r_tyyppi == 11
					) {
						hinta = replyObj[i].hinta;
					}

					$("#raportointiosastovalinnat").append(
						"<div id='raportointiosastovalintakehys_" +
							replyObj[i].id +
							"' class='valintakehys' style='background-color:" +
							replyObj[i].taustavari +
							"'>" +
							"<input id='raportointiosastovalinta_" +
							replyObj[i].id +
							"' type='checkbox' value='" +
							replyObj[i].id +
							"' checked" +
							isDisabled +
							" />" +
							"<span>" +
							replyObj[i].raporttinumero +
							" " +
							replyObj[i].nimi +
							"</span>" +
							"<span class='raportointiosastohintaTeksti'>" +
							hinta +
							"</span>" +
							"</div>"
					);

					if (isDisabled == "") {
						$("#raportointiosastovalintakehys_" + replyObj[i].id).click(
							function () {
								let id = $(this)
									.prop("id")
									.replace("raportointiosastovalintakehys_", "");
								if (
									$("#raportointiosastovalinta_" + id).prop("checked") == true
								) {
									$("#raportointiosastovalinta_" + id).prop("checked", false);
									$("#raportointivalitseosastot").prop("checked", false);
								} else {
									$("#raportointiosastovalinta_" + id).prop("checked", true);
									if (
										$("#raportointiosastovalinnat input:checked").length ==
										$("#raportointiosastovalinnat input").length
									) {
										$("#raportointivalitseosastot").prop("checked", true);
									}
								}
							}
						);
					}

					$("#raportointiosastovalinta_" + replyObj[i].id).click(function (
						painiketapahtuma
					) {
						painiketapahtuma.stopPropagation();
						if ($(this).prop("checked") == false) {
							$("#raportointivalitseosastot").prop("checked", false);
						} else if (
							$("#raportointiosastovalinnat input:checked").length ==
							$("#raportointiosastovalinnat input").length
						) {
							$("#raportointivalitseosastot").prop("checked", true);
						}
					});
				}

				$("#raportointivalitseosastot").prop("checked", true);
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function raportointi_hae_henkilot() {
	$("#raportointihenkilovalinnat").html("");

	if ($("#raportointihenkilostovalinta").val() == -1) {
		return;
	}

	let raportti_toimialue_idt = "";
	let raportti_palvelualue_idt = "";
	let jarjestysvalinta = $("#raportointihenkiloarjestysvalinta").val();
	let r_henkilosto = $("#raportointihenkilostovalinta").val();
	let r_tyyppi = $("#raportointiraporttivalinta").val();

	if (
		$("#raportointiraporttivalinta").val() < 6 ||
		$("#raportointiraporttivalinta").val() == 11
	) {
		$("#raportointialuevalinnat input:checked").each(function () {
			raportti_toimialue_idt += ",'" + this.value + "'";
		});

		if (raportti_toimialue_idt.length > 0) {
			raportti_toimialue_idt = raportti_toimialue_idt.substr(1);
		} else {
			$("#raportointivalitsehenkilot").prop("checked", false);
			return;
		}
	} else {
		$("#raportointialuevalinnat input:checked").each(function () {
			raportti_palvelualue_idt += ",'" + this.value + "'";
		});

		if (raportti_palvelualue_idt.length > 0) {
			raportti_palvelualue_idt = raportti_palvelualue_idt.substr(1);
		} else {
			$("#raportointivalitsehenkilot").prop("checked", false);
			return;
		}
	}

	$.post(
		"php/hae_raportti_henkilo_valinnat.php",
		{
			toimialue_idt: raportti_toimialue_idt,
			palvelualue_idt: raportti_palvelualue_idt,
			jarjestys: jarjestysvalinta,
			henkilosto: r_henkilosto,
			tyyppi: r_tyyppi,
		},
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				for (let i = 0; i < replyObj.length; i++) {
					$("#raportointihenkilovalinnat").append(
						"<div id='raportointihenkilovalintakehys_" +
							replyObj[i].id +
							"' class='valintakehys' style='background-color:" +
							replyObj[i].taustavari +
							"'>" +
							"<input id='raportointihenkilovalinta_" +
							replyObj[i].id +
							"' type='checkbox' value='" +
							replyObj[i].id +
							"' checked />" +
							"<span>" +
							replyObj[i].nimi +
							"</span>" +
							"</div>"
					);

					$("#raportointihenkilovalintakehys_" + replyObj[i].id).click(
						function () {
							let id = $(this)
								.prop("id")
								.replace("raportointihenkilovalintakehys_", "");
							if (
								$("#raportointihenkilovalinta_" + id).prop("checked") == true
							) {
								$("#raportointihenkilovalinta_" + id).prop("checked", false);
								$("#raportointivalitsehenkilot").prop("checked", false);
							} else {
								$("#raportointihenkilovalinta_" + id).prop("checked", true);
								if (
									$("#raportointihenkilovalinnat input:checked").length ==
									$("#raportointihenkilovalinnat input").length
								) {
									$("#raportointivalitsehenkilot").prop("checked", true);
								}
							}
						}
					);

					$("#raportointihenkilovalinta_" + replyObj[i].id).click(function (
						painiketapahtuma
					) {
						painiketapahtuma.stopPropagation();
						if ($(this).prop("checked") == false) {
							$("#raportointivalitsehenkilot").prop("checked", false);
						} else if (
							$("#raportointihenkilovalinnat input:checked").length ==
							$("#raportointihenkilovalinnat input").length
						) {
							$("#raportointivalitsehenkilot").prop("checked", true);
						}
					});
				}

				$("#raportointivalitsehenkilot").prop("checked", true);
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function raportointi_tarkista_raporttityyppi_toiminta() {
	if ($("#raportointiraporttivalinta").val() == 12) {
		raportointi_luo_jarjestelmaraportti();
	} else {
		raportointi_nayta_luo_raportti_ruutu();
	}
}

function raportointi_nayta_luo_raportti_ruutu() {
	$("#raportointityhjavalintakehys").hide();
	$("#raportointityhjavalinta").prop("checked", false);
	$("#raportointilatauskuva").hide();

	if ($("#raportointiraporttivalinta").val() != -1) {
		if (
			!raportointi_kuukausi_tila &&
			($("#raportointialkupvm").val() == "" ||
				$("#raportointiloppupvm").val() == "")
		) {
			alert("Tarkista aikaväli");
			return;
		}

		if ($("#raportointihenkilovalinnat input:checkbox:checked").length <= 0) {
			alert("Valitse yksi tai useampi henkilö");
			return;
		}

		if ($("#raportointialuevalinnat input:checked").length == 0) {
			if (
				$("#raportointiraporttivalinta").val() < 6 ||
				$("#raportointiraporttivalinta").val() == 11
			) {
				alert("Valitse yksi tai useampi toimialue");
			} else {
				alert("Valitse yksi tai useampi palvelualue");
			}
			return;
		}

		if (
			$("#raportointiraporttivalinta").val() == 0 ||
			$("#raportointiraporttivalinta").val() == 3 ||
			$("#raportointiraporttivalinta").val() == 6
		) {
			$("#raportointityhjavalintakehys").show();
			if ($("#raportointitaustavalinnat input:checkbox:checked").length <= 0) {
				alert("Valitse yksi tai useampi tausta");
				return;
			}
		}

		if (
			$("#raportointiraporttivalinta").val() == 0 ||
			$("#raportointiraporttivalinta").val() == 1 ||
			$("#raportointiraporttivalinta").val() == 11 ||
			$("#raportointiraporttivalinta").val() == 3 ||
			$("#raportointiraporttivalinta").val() == 4 ||
			$("#raportointiraporttivalinta").val() == 6 ||
			$("#raportointiraporttivalinta").val() == 7
		) {
			if ($("#raportointiosastovalinnat input:checkbox:checked").length <= 0) {
				alert("Valitse yksi tai useampi osasto");
				return;
			}
		}

		if (raportointi_kuukausi_tila) {
			const pvm = $("#raportointivuosikuukausi").datepicker("getDate");
			let kk = pvm.getMonth() + 1;
			const loppu_pvm = new Date(pvm.getFullYear(), kk, 0);
			let paiva = loppu_pvm.getDate();
			if (kk <= 9) {
				kk = "0" + kk;
			}
			if (paiva <= 9) {
				paiva = "0" + paiva;
			}
			$("#raportointiTeksti").html(
				"Haluatko luoda raportin aikaväliltä 01." +
					kk +
					"." +
					pvm.getFullYear() +
					" - " +
					paiva +
					"." +
					kk +
					"." +
					pvm.getFullYear() +
					" ?"
			);
		} else {
			$("#raportointiTeksti").html(
				"Haluatko luoda raportin aikaväliltä " +
					$("#raportointialkupvm").val() +
					" - " +
					$("#raportointiloppupvm").val() +
					" ?"
			);
		}

		$("#raportointiRuutu").dialog("open");
	}
}

function raportointi_luo_raportti() {
	$(".raporttikentta").val("");

	let r_tyyppi = $("#raportointiraporttivalinta").val();

	if ($("#raportointiraporttivalinta").val() == -1) {
		alert("Valitse raporttityyppi");
		return;
	}

	let r_toimialue_idt = "";
	let r_palvelualue_idt = "";
	if (r_tyyppi < 6 || r_tyyppi == 11) {
		$("#raportointialuevalinnat input:checked").each(function () {
			r_toimialue_idt += ",'" + this.value + "'";
		});

		if (r_toimialue_idt.length > 0) {
			r_toimialue_idt = r_toimialue_idt.substr(1);
		} else {
			alert("Valitse yksi tai useampi toimialue");
			return;
		}
	} else {
		$("#raportointialuevalinnat input:checked").each(function () {
			r_palvelualue_idt += ",'" + this.value + "'";
		});

		if (r_palvelualue_idt.length > 0) {
			r_palvelualue_idt = r_palvelualue_idt.substr(1);
		} else {
			alert("Valitse yksi tai useampi palvelualue");
			return;
		}
	}

	let r_alkupvm = "";
	let r_loppupvm = "";

	if (raportointi_kuukausi_tila) {
		const pvm = $("#raportointivuosikuukausi").datepicker("getDate");
		let kk = pvm.getMonth() + 1;
		const loppu_pvm = new Date(pvm.getFullYear(), kk, 0);
		let paiva = loppu_pvm.getDate();
		if (kk <= 9) {
			kk = "0" + kk;
		}
		if (paiva <= 9) {
			paiva = "0" + paiva;
		}

		r_alkupvm = "01." + kk + "." + pvm.getFullYear();
		r_loppupvm = paiva + "." + kk + "." + pvm.getFullYear();
	} else {
		r_alkupvm = $("#raportointialkupvm").val();
		r_loppupvm = $("#raportointiloppupvm").val();
	}

	if (r_alkupvm == "" || r_loppupvm == "") {
		alert("Tarkista aikaväli");
		return;
	}

	let r_henkilosto = $("#raportointihenkilostovalinta").val();

	if (r_henkilosto == -1) {
		alert("Tarkista henkilosto");
		return;
	}

	let r_tausta_idt = "";
	let r_osasto_idt = "";
	let r_henkilo_idt = "";

	if (
		r_tyyppi == 0 ||
		r_tyyppi == 1 ||
		r_tyyppi == 11 ||
		r_tyyppi == 3 ||
		r_tyyppi == 4 ||
		r_tyyppi == 6 ||
		r_tyyppi == 7
	) {
		$("#raportointiosastovalinnat input:checked").each(function () {
			r_osasto_idt += ",'" + this.value + "'";
		});

		if (r_osasto_idt.length > 0) {
			r_osasto_idt = r_osasto_idt.substr(1);
		} else {
			alert("Valitse yksi tai useampi osasto");
			return;
		}

		if (r_tyyppi == 0 || r_tyyppi == 3 || r_tyyppi == 6) {
			$("#raportointitaustavalinnat input:checked").each(function () {
				r_tausta_idt += ",'" + this.value + "'";
			});

			if (r_tausta_idt.length > 0) {
				r_tausta_idt = r_tausta_idt.substr(1);
			} else {
				alert("Valitse yksi tai useampi tausta");
				return;
			}
		}
	}

	$("#raportointihenkilovalinnat input:checked").each(function () {
		r_henkilo_idt += ",'" + this.value + "'";
	});

	if (r_henkilo_idt.length > 0) {
		r_henkilo_idt = r_henkilo_idt.substr(1);
	} else {
		alert("Valitse yksi tai useampi henkilo");
		return;
	}

	let r_tyhjat = 0;
	if ($("#raportointityhjavalinta").prop("checked") == true) {
		r_tyhjat = 1;
	}

	$("#raporttitieto_raporttityyppi").val(r_tyyppi);
	$("#raporttitieto_alkupvm").val(r_alkupvm);
	$("#raporttitieto_loppupvm").val(r_loppupvm);
	$("#raporttitieto_toimialue_idt").val(r_toimialue_idt);
	$("#raporttitieto_palvelualue_idt").val(r_palvelualue_idt);
	$("#raporttitieto_tausta_idt").val(r_tausta_idt);
	$("#raporttitieto_osasto_idt").val(r_osasto_idt);
	$("#raporttitieto_henkilo_idt").val(r_henkilo_idt);
	$("#raporttitieto_henkilosto").val(r_henkilosto);
	$("#raporttitieto_tyhjat").val(r_tyhjat);

	$("#raportointiRuutu").dialog("close");
	$("#raporttitieto").submit();
	$(".raporttikentta").val("");
}

function raportointi_luo_jarjestelmaraportti() {
	$(".jarjestelmaraporttikentta").val("");

	let r_tyyppi = $("#raportointiraporttivalinta").val();

	$("#raportointijarjestelmatieto_raporttityyppi").val(r_tyyppi);

	$("#raportointijarjestelmatieto").submit();
	$(".jarjestelmaraporttikentta").val("");
}

function raportointi_nayta_ladattavat_siirtotiedostot_ruutu() {
	raportointi_hae_siirtotiedostot();
	$("#raportointiladattavatsiirtotiedostotRuutu").dialog("open");
}

function raportointi_hae_siirtotiedostot() {
	$("#raportointisiirtotiedostohoitajat").html("");
	$("#raportointisiirtotiedostosihteerit").html("");
	$("#raportointisiirtotiedostohoitajamatkat").html("");
	$("#raportointisiirtotiedostosihteerimatkat").html("");

	$.post("php/hae_siirtotiedostot.php", {}, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);

			const hoitajatiedostot = replyObj["hoitajatiedostot"];
			for (let i = 0; i < hoitajatiedostot.length; i++) {
				let osoite =
					window.location.href + "tiedostot/" + hoitajatiedostot[i].nimi;

				$("#raportointisiirtotiedostohoitajat").append(
					"<div id='raportointisiirtotiedostohoitajatkehys_" +
						i +
						"' class='valintakehys siirtotiedostovalinta'>" +
						"<a id='raportointisiirtotiedostohoitajat_" +
						i +
						"' href='" +
						osoite +
						"' target='_blank' class='siirtotiedostovalintateksti' download>" +
						hoitajatiedostot[i].nimi +
						"</a>" +
						"</div>"
				);

				$("#raportointisiirtotiedostohoitajat_" + i).click(function (
					painiketapahtuma
				) {
					painiketapahtuma.stopPropagation();
				});

				$("#raportointisiirtotiedostohoitajatkehys_" + i).click(function () {
					let id = $(this)
						.prop("id")
						.replace("raportointisiirtotiedostohoitajatkehys_", "");
					$("#raportointisiirtotiedostohoitajat_" + id)[0].click();
				});
			}

			const sihteeritiedostot = replyObj["sihteeritiedostot"];
			for (let i = 0; i < sihteeritiedostot.length; i++) {
				let osoite =
					window.location.href + "tiedostot/" + sihteeritiedostot[i].nimi;

				$("#raportointisiirtotiedostosihteerit").append(
					"<div id='raportointisiirtotiedostosihteeritkehys_" +
						i +
						"' class='valintakehys siirtotiedostovalinta'>" +
						"<a id='raportointisiirtotiedostosihteerit_" +
						i +
						"' href='" +
						osoite +
						"' target='_blank' class='siirtotiedostovalintateksti' download>" +
						sihteeritiedostot[i].nimi +
						"</a>" +
						"</div>"
				);

				$("#raportointisiirtotiedostosihteerit_" + i).click(function (
					painiketapahtuma
				) {
					painiketapahtuma.stopPropagation();
				});

				$("#raportointisiirtotiedostosihteeritkehys_" + i).click(function () {
					let id = $(this)
						.prop("id")
						.replace("raportointisiirtotiedostosihteeritkehys_", "");
					$("#raportointisiirtotiedostosihteerit_" + id)[0].click();
				});
			}

			const hoitajamatkattiedostot = replyObj["hoitajamatkatiedostot"];
			for (let i = 0; i < hoitajamatkattiedostot.length; i++) {
				let osoite =
					window.location.href + "tiedostot/" + hoitajamatkattiedostot[i].nimi;

				$("#raportointisiirtotiedostohoitajamatkat").append(
					"<div id='raportointisiirtotiedostohoitajamatkatkehys_" +
						i +
						"' class='valintakehys siirtotiedostovalinta'>" +
						"<a id='raportointisiirtotiedostohoitajamatkat_" +
						i +
						"' href='" +
						osoite +
						"' target='_blank' class='siirtotiedostovalintateksti' download>" +
						hoitajamatkattiedostot[i].nimi +
						"</a>" +
						"</div>"
				);

				$("#raportointisiirtotiedostohoitajamatkat_" + i).click(function (
					painiketapahtuma
				) {
					painiketapahtuma.stopPropagation();
				});

				$("#raportointisiirtotiedostohoitajamatkatkehys_" + i).click(
					function () {
						let id = $(this)
							.prop("id")
							.replace("raportointisiirtotiedostohoitajamatkatkehys_", "");
						$("#raportointisiirtotiedostohoitajamatkat_" + id)[0].click();
					}
				);
			}

			const sihteerimatkatiedostot = replyObj["sihteerimatkatiedostot"];
			for (let i = 0; i < sihteerimatkatiedostot.length; i++) {
				let osoite =
					window.location.href + "tiedostot/" + sihteerimatkatiedostot[i].nimi;

				$("#raportointisiirtotiedostosihteerimatkat").append(
					"<div id='raportointisiirtotiedostosihteerimatkatkehys_" +
						i +
						"' class='valintakehys siirtotiedostovalinta'>" +
						"<a id='raportointisiirtotiedostosihteerimatkat_" +
						i +
						"' href='" +
						osoite +
						"' target='_blank' class='siirtotiedostovalintateksti' download>" +
						sihteeritiedostot[i].nimi +
						"</a>" +
						"</div>"
				);

				$("#raportointisiirtotiedostosihteerimatkat_" + i).click(function (
					painiketapahtuma
				) {
					painiketapahtuma.stopPropagation();
				});

				$("#raportointisiirtotiedostosihteerimatkatkehys_" + i).click(
					function () {
						let id = $(this)
							.prop("id")
							.replace("raportointisiirtotiedostosihteerimatkatkehys_", "");
						$("#raportointisiirtotiedostosihteerimatkat_" + id)[0].click();
					}
				);
			}
		}
	});
}

function raportointi_nayta_siirtotiedosto_ruutu() {
	$("#raportointisiirtotiedostovalinta").val(-1);
	$("#raportointisiirtotiedostovuosikuukausi").datepicker("setDate", "-1m");
	$("#raportointisiirtotiedostoruutu").dialog("open");
}

function raportointi_nayta_siirtotiedosto_varmistus_ruutu() {
	if (siirtotiedostoluonti == true) {
		if ($("#raportointisiirtotiedostovalinta").val() == -1) {
			alert("Valitse tyyppi");
			return;
		}

		let tyyppi = " hoitajille - ";
		if ($("#raportointisiirtotiedostovalinta").val() == 1) {
			tyyppi = " sihteereille - ";
		}
		$("#raportointisiirtotiedostoteksti").html(
			"Haluatko luoda kirjanpitotiedoston " +
				tyyppi +
				$.datepicker.formatDate(
					"MM yy",
					$("#raportointisiirtotiedostovuosikuukausi").datepicker("getDate")
				) +
				" ?"
		);
		$("#raportointisiirtotiedostovarmistusRuutu").dialog("open");
	} else {
		alert("Ei oikeuksia");
		return;
	}
}

function raportointi_luo_tiedosto() {
	if (siirtotiedostoluonti == false) {
		return;
	}

	let r_tyyppi = $("#raportointisiirtotiedostovalinta").val();
	if (r_tyyppi == -1) {
		alert("Valitse siirtotiedoston tyyppi");
		return;
	}

	const pvm = $("#raportointisiirtotiedostovuosikuukausi").datepicker(
		"getDate"
	);
	const r_vuosi = pvm.getFullYear();
	const r_kuukausi = pvm.getMonth() + 1;

	if (r_vuosi == "" || r_kuukausi == "") {
		alert("Tarkista kuukausi");
		return;
	}
	$("#raportointilatauskuva").show();
	$.post(
		"php/luo_tiedosto.php",
		{ raporttityyppi: r_tyyppi, vuosi: r_vuosi, kuukausi: r_kuukausi },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let vastaus = JSON.parse(reply);
				if (vastaus["rivimaara"] > 0) {
					nayta_tilaviesti(
						`Siirtotiedosto luotu (${vastaus["rivimaara"]} riviä)`
					);
				} else {
					nayta_tilaviesti(`Siirtotiedoston luonti epäonnistui (Ei rivejä)`);
				}
				$("#raportointisiirtotiedostoruutu").dialog("close");
				$("#raportointisiirtotiedostovarmistusRuutu").dialog("close");
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

/******************* VIESTINTÄ **********************************/

function alusta_viestinta() {
	if (!viestinta_alustettu) {
		$("#viestintavalitsesijaiset").change(function () {
			if ($("#viestintavalitsesijaiset").prop("checked")) {
				$("#viestintasijaisvalinnat")
					.find("input[type=checkbox]")
					.prop("checked", true);
			} else {
				$("#viestintasijaisvalinnat")
					.find("input[type=checkbox]")
					.prop("checked", false);
			}
		});

		$(".viestintalahettajavalinta").click(function () {
			let tila = false;
			if ($(this).prop("checked") == true) {
				tila = true;
			}

			$(".viestintalahettajavalinta").prop("checked", false);
			$(this).prop("checked", tila);
		});

		$("#viestintaviesti").keyup(function () {
			let merkkimaara_maksimi = 160;
			let merkkimaara = $("#viestintaviesti").val().length;
			let merkkeja_jaljella = merkkimaara_maksimi - merkkimaara;
			if (merkkeja_jaljella == 1) {
				$("#viestintaviestimerkit").html(
					merkkeja_jaljella + " merkki jäljellä"
				);
			} else {
				$("#viestintaviestimerkit").html(
					merkkeja_jaljella + " merkkiä jäljellä"
				);
			}
		});

		viestinta_alustettu = true;
	}

	$("#viestintavalitsesijaiset").prop("checked", false);
	$("#viestintaviesti").val("");
	$("#viestintaviestimerkit").html("160 merkkiä jäljellä");
	$("#viestintanakyma button").button();
	$(".viestintalahettajavalinta").prop("checked", false);
	viestinta_hae_toimialueet();
}

function viestinta_hae_toimialueet() {
	$("#viestintatoimialuevalinnat").html("");

	$.post(
		"php/hae_toimialue_valinnat.php",
		{ toimialue_idt: kayttaja_toimialue_idt },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);

				for (let i = 0; i < replyObj.length; i++) {
					$("#viestintatoimialuevalinnat").append(
						"<div class='viestintatoimialuevalintakehys'>" +
							"<input id='viestintatoimialuevalinta_" +
							replyObj[i].id +
							"' type='checkbox' value='" +
							replyObj[i].id +
							"' />" +
							"<span id='viestintatoimialuevalintaTeksti_" +
							replyObj[i].id +
							"' class='viestintatoimialuevalintaTeksti'>" +
							replyObj[i].nimi +
							"</span>" +
							"</div>"
					);

					$("#viestintatoimialuevalinta_" + replyObj[i].id).click(function () {
						viestinta_hae_sijaiset();
					});
				}
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function viestinta_hae_sijaiset() {
	let viestinta_toimialue_idt = "";
	$("#viestintasijaisvalinnat").html("");

	$("#viestintatoimialuevalinnat input:checked").each(function () {
		viestinta_toimialue_idt += ",'" + this.value + "'";
	});

	if (viestinta_toimialue_idt.length > 0) {
		viestinta_toimialue_idt = viestinta_toimialue_idt.substr(1);
	} else {
		$("#viestintavalitsesijaiset").prop("checked", false);
		return;
	}

	$.post(
		"php/hae_tilapaiset_sijaiset.php",
		{ toimialue_idt: viestinta_toimialue_idt },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				for (let i = 0; i < replyObj.length; i++) {
					$("#viestintasijaisvalinnat").append(
						"<div>" +
							"<input id='viestintasijaisvalinta_" +
							replyObj[i].id +
							"' type='checkbox' value='" +
							replyObj[i].id +
							"' />" +
							"<span>" +
							replyObj[i].nimike +
							" " +
							replyObj[i].nimi +
							"</span>" +
							"</div>"
					);

					$("#viestintasijaisvalinta_" + replyObj[i].id).click(function () {
						if ($(this).prop("checked") == false) {
							$("#viestintavalitsesijaiset").prop("checked", false);
						} else if (
							$("#viestintasijaisvalinnat input:checked").length ==
							$("#viestintasijaisvalinnat input").length
						) {
							$("#viestintavalitsesijaiset").prop("checked", true);
						}
					});
				}

				$("#viestintasijaisvalinnat input").prop("checked", true);
				$("#viestintavalitsesijaiset").prop("checked", true);
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function viestinta_laheta_viesti() {
	let v_sijais_idt = "";
	let v_viesti = "";
	let v_lahettaja = 0;

	v_viesti = $("#viestintaviesti").val();

	$("#viestintasijaisvalinnat input:checked").each(function () {
		v_sijais_idt += "," + this.value;
	});

	if (v_sijais_idt.length > 0) {
		v_sijais_idt = v_sijais_idt.substr(1);
	} else {
		alert("Valitse yksi tai useampi sissi");
		return;
	}

	if (v_viesti == "") {
		alert("Tarkista viesti");
		return;
	}

	if ($("#viestintalahettajavalinta_sairaala").prop("checked") == true) {
		v_lahettaja = $("#viestintalahettaja").html();
	} else if ($("#viestintalahettajavalinta_omanro").prop("checked") == true) {
		if (
			$("#viestintalahettajanumero").val() != "" &&
			$("#viestintalahettajanumero")
				.val()
				.match(/^[\d\+]+$/)
		) {
			v_lahettaja = $("#viestintalahettajanumero").val();
		} else {
			alert("Tarkista numero");
			return;
		}
	} else {
		v_lahettaja = "+46700861097";
	}

	$.post(
		"php/laheta_ryhmaviesti.php",
		{ sijais_idt: v_sijais_idt, viesti: v_viesti, lahettaja: v_lahettaja },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				$("#viestintaviesti").val("");
				if (replyObj.length > 0) {
					if (replyObj[0].kpl == 1) {
						alert(replyObj[0].kpl + " viesti lähetetty");
					} else {
						alert(replyObj[0].kpl + " viestiä lähetetty");
					}
				}
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

/******************* RESERVINÄKYMÄ **********************************/

function alusta_reservinakyma() {
	if (!reservinakyma_alustettu) {
		//Kalentereiden alustus
		$("#reservi_alku_pvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (dateText, inst) {
				$("#reservi_loppu_pvm").datepicker("option", "minDate", dateText);
				reservi_hae_reservilaiset();
			},
		});

		//Aseta pvm_kentta tyhjennys del (46) tai backspace (8) näppäimestä
		$("#reservi_alku_pvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#reservi_alku_pvm"));
			}
		});

		$("#reservi_loppu_pvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (dateText, inst) {
				$("#reservi_alku_pvm").datepicker("option", "maxDate", dateText);
				reservi_hae_reservilaiset();
			},
		});

		//Aseta pvm_kentta tyhjennys del (46) tai backspace (8) näppäimestä
		$("#reservi_loppu_pvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#reservi_loppu_pvm"));
			}
		});

		$("#reservi_reservilaishaku_hakusana").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 13) {
				reservi_hae_reservilaiset();
			}
		});

		$("#reservi_tyojaksohaku_hakusana").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 13) {
				reservi_hae_reservilaiset();
			}
		});

		$("#reservitoimialuesuodatin").change(function () {
			reservi_hae_reservilaiset();
		});

		//Alustaa latausruudun
		$("#reservilatausRuutu").dialog({
			autoOpen: false,
			title: "Haetaan työjaksoja...",
			width: 350,
			dialogClass: "ei_sulku_painiketta",
		});

		//Alustaa poistoruudun
		$("#reservipoistoRuutu").dialog({
			autoOpen: false,
			modal: true,
			width: 650,
			title: "Poista työjakso",
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						reservi_poista_tyojakso();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		reservinakyma_alustettu = true;
	}

	let tanaan = new Date();

	$("#reservitoimialuesuodatin").html("");
	$("#reservitoimialuepikavalinnat").html("");
	$("#reservinakyma input").val("");
	$("#reservi_haku_valikko").val("nimi");
	$("#reservi_poisto_id").html("");
	$("#reservi_poisto_teksti").html("");
	$("#reservi_haku_painike").button("option", "disabled", false);
	$("#reservitauludata").html("");
	$.datepicker._clearDate($("#reservi_alku_pvm"));
	$.datepicker._clearDate($("#reservi_loppu_pvm"));
	$("#reservi_alku_pvm").val("01.01." + tanaan.getFullYear());
	$("#reservi_reservilaishaku_haettavaarvo").val("nimi");
	$("#reservi_tyojaksohaku_haettavaarvo").prop("selectedIndex", 0);
	$("#reservi_varoitusvalinta").prop("checked", true);
	$("#reservi_alanakyma").css("background-color", "#deedf7");

	//Suorittaa $.post kutsut, kun kaikki kutsut on valmiita, kutsu funktiota
	$.when(
		reservi_hae_osasto_valinnat(),
		reservi_hae_tyomaara_valinnat(),
		reservi_hae_reservitausta_valinnat(),
		reservi_hae_toimialue_valinnat()
	).then(function () {
		reservi_hae_reservilaiset();
	});
}

function reservi_hae_toimialue_valinnat() {
	$("#reservitoimialuesuodatin").html("");
	$("#reservitoimialuepikavalinnat").html(
		"<button id='reservitoimialuevalinta_0' class='toimialuepainike'>Kaikki</button>"
	);

	$("#reservitoimialuevalinta_0").click(function () {
		$("#reservitoimialuepikavalinnat button").removeClass(
			"painike_valittu_tila"
		);
		$(this).addClass("painike_valittu_tila");
		$("#reservitoimialuesuodatin option").prop("selected", "selected");
		reservi_hae_reservilaiset();
	});

	let valmis = $.Deferred();

	$.post(
		"php/hae_toimialue_valinnat.php",
		{ toimialue_idt: kayttaja_toimialue_idt },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);

				for (let i = 0; i < replyObj.length; i++) {
					$("#reservitoimialuepikavalinnat").append(
						"<button id='reservitoimialuevalinta_" +
							replyObj[i].id +
							"' class='toimialuepainike'>" +
							replyObj[i].lyhenne +
							"</button>"
					);
					$("#reservitoimialuesuodatin").append(
						"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].nimi +
							"</option>"
					);

					$("#reservitoimialuevalinta_" + replyObj[i].id).click(function (
						painiketapahtuma
					) {
						let toimialue_id = $(this)
							.prop("id")
							.replace("reservitoimialuevalinta_", "");
						let valitut_toimialue_idt = $("#reservitoimialuesuodatin").val();

						if (
							$("#reservitoimialuevalinta_0").hasClass(
								"painike_valittu_tila"
							) &&
							$("#reservitoimialuesuodatin option").length ==
								valitut_toimialue_idt.length
						) {
							$("#reservitoimialuepikavalinnat button").removeClass(
								"painike_valittu_tila"
							);
							$("#reservitoimialuesuodatin").val(toimialue_id).change();
							$(this).addClass("painike_valittu_tila");
						} else {
							if (painiketapahtuma.ctrlKey == true) {
								if ($(this).hasClass("painike_valittu_tila")) {
									if (
										$("#reservitoimialuepikavalinnat .painike_valittu_tila")
											.length > 1
									) {
										$(this).removeClass("painike_valittu_tila");
										if (valitut_toimialue_idt.indexOf(toimialue_id) >= 0) {
											valitut_toimialue_idt.splice(
												valitut_toimialue_idt.indexOf(toimialue_id),
												1
											);
										}
										$("#reservitoimialuesuodatin")
											.val(valitut_toimialue_idt)
											.change();
									}
								} else {
									valitut_toimialue_idt.push(toimialue_id);
									$("#reservitoimialuesuodatin")
										.val(valitut_toimialue_idt)
										.change();
									if (
										$("#reservitoimialuesuodatin option").length ==
										valitut_toimialue_idt.length
									) {
										$("#reservitoimialuepikavalinnat button").removeClass(
											"painike_valittu_tila"
										);
										$("#reservitoimialuevalinta_0").addClass(
											"painike_valittu_tila"
										);
									} else {
										$(this).addClass("painike_valittu_tila");
									}
								}
							} else {
								$("#reservitoimialuepikavalinnat button").removeClass(
									"painike_valittu_tila"
								);
								$("#reservitoimialuesuodatin").val(toimialue_id).change();
								$(this).addClass("painike_valittu_tila");
							}
						}
					});
				}

				$("#reservitoimialuepikavalinnat button").button();
				$("#reservitoimialuevalinta_0").addClass("painike_valittu_tila");
				$("#reservitoimialuesuodatin option").prop("selected", "selected");
			} else {
				alert("Tietokantavirhe");
			}

			valmis.resolve();
		}
	);

	return valmis;
}

function reservi_hae_osasto_valinnat() {
	reservi_osasto_valinnat = "<option value='0'>Valitse</option>";

	let valmis = $.Deferred();

	$.post(
		"php/hae_osasto_valinnat.php",
		{ jarjestys: "lyhenne" },
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				if (replyObj.length > 0) {
					for (let i = 0; i < replyObj.length; i++) {
						let aktiivinen = "";
						if (replyObj[i].aktiivinen == 0) {
							aktiivinen = " disabled";
						}
						if (replyObj[i].toimialue_id != 0) {
							reservi_osasto_valinnat +=
								"<option value='" +
								replyObj[i].id +
								"'" +
								aktiivinen +
								">(" +
								replyObj[i].lyhenne +
								") " +
								replyObj[i].nimi +
								"</option>";
						}
					}
				}
			} else {
				alert("Tietokantavirhe");
			}

			valmis.resolve();
		}
	);

	return valmis;
}

function reservi_hae_tyomaara_valinnat() {
	reservi_tyomaara_valinnat = "<option value='0'>Valitse</option>";

	let valmis = $.Deferred();

	$.post("php/hae_tyomaara_valinnat.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			if (replyObj.length > 0) {
				for (let i = 0; i < replyObj.length; i++) {
					reservi_tyomaara_valinnat +=
						"<option value='" +
						replyObj[i].id +
						"'>" +
						replyObj[i].prosentti +
						"%</option>";
				}
			}
		} else {
			alert("Tietokantavirhe");
		}

		valmis.resolve();
	});

	return valmis;
}

function reservi_hae_reservitausta_valinnat() {
	reservi_reservitausta_valinnat = "<option value='0'>Valitse</option>";

	let valmis = $.Deferred();

	$.post("php/hae_reservitausta_valinnat.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			if (replyObj.length > 0) {
				for (let i = 0; i < replyObj.length; i++) {
					reservi_reservitausta_valinnat +=
						"<option value='" +
						replyObj[i].id +
						"'>" +
						replyObj[i].numero +
						" = " +
						replyObj[i].selite +
						"</option>";
				}
			}
		} else {
			alert("Tietokantavirhe");
		}

		valmis.resolve();
	});

	return valmis;
}

function reservi_aseta_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == reservi_jarjestysarvo) {
		if (reservi_jarjestys == "DESC") {
			reservi_jarjestys = "ASC";
		} else {
			reservi_jarjestys = "DESC";
		}
	} else {
		reservi_jarjestysarvo = jarjestysarvo;
		reservi_jarjestys = "ASC";
	}

	reservi_hae_reservilaiset();
}

function reservi_hae_reservilaiset() {
	let re_haku = $("#reservi_reservilaishaku_hakusana").val();
	let re_arvo = $("#reservi_reservilaishaku_haettavaarvo").val();
	let re_tilavalinta = 1;
	let re_varoitustila = 1;
	if ($("#reservi_varoitusvalinta").prop("checked") == false) {
		re_varoitustila = 0;
	}
	let re_toimialue_idt = $("#reservitoimialuesuodatin").val();
	let tj_alkupvm = $.datepicker.formatDate(
		"dd.mm.yy",
		$("#reservi_alku_pvm").datepicker("getDate")
	);
	let tj_loppupvm = $.datepicker.formatDate(
		"dd.mm.yy",
		$("#reservi_loppu_pvm").datepicker("getDate")
	);
	let tj_haku = $("#reservi_tyojaksohaku_hakusana").val();
	let tj_arvo = $("#reservi_tyojaksohaku_haettavaarvo").val();

	if (re_haku != "" || tj_haku != "") {
		$("#reservi_alanakyma").css("background-color", "#fff7aa");
	} else {
		$("#reservi_alanakyma").css("background-color", "#deedf7");
	}

	$("#reservi_maara").html("0 reserviläistä");

	$.post(
		"php/hae_aktiiviset_reservilaiset.php",
		{
			re_hakusana: re_haku,
			re_haettavaarvo: re_arvo,
			re_tila: re_tilavalinta,
			re_varoitus: re_varoitustila,
			re_toimialue: re_toimialue_idt,
			tj_alku_pvm: tj_alkupvm,
			tj_loppu_pvm: tj_loppupvm,
			tj_hakusana: tj_haku,
			tj_haettavaarvo: tj_arvo,
			jarjestys: reservi_jarjestys,
			jarjestettavaarvo: reservi_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "[]":
						$("#reservitauludata").html("");
						$("#reservitauludata").append(
							"<tr>" +
								"<td colspan='4'><span>Reserviläisiä ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					case "parametri":
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#reservitauludata").html("");
						let reservilaismaara = replyObj[0];
						if (reservilaismaara == 1) {
							$("#reservi_maara").html(reservilaismaara + " reserviläinen");
						} else {
							$("#reservi_maara").html(reservilaismaara + " reserviläistä");
						}

						for (let i = 1; i < replyObj.length; i++) {
							let tyojakso_tarkistus = "";

							let alittuvat_tyomaara_tiedot =
								replyObj[i].alittuvat_tyomaara_tiedot;
							for (let tyomaara in alittuvat_tyomaara_tiedot) {
								if ($("#reservi_varoitusvalinta").prop("checked")) {
									tyojakso_tarkistus +=
										"<img src='css/imgs/varoitus.png' class='varoitus_kuvake' alt='Tyomäärä alittuu'/>" +
										tyomaara +
										"%";
								} else {
									if (alittuvat_tyomaara_tiedot[tyomaara] > 1) {
										tyojakso_tarkistus +=
											"<img src='css/imgs/varoitus.png' class='varoitus_kuvake' alt='Tyomäärä alittuu'/>" +
											tyomaara +
											"% / " +
											alittuvat_tyomaara_tiedot[tyomaara] +
											" jaksoa";
									} else {
										tyojakso_tarkistus +=
											"<img src='css/imgs/varoitus.png' class='varoitus_kuvake' alt='Tyomäärä alittuu'/>" +
											tyomaara +
											"% / " +
											alittuvat_tyomaara_tiedot[tyomaara] +
											" jakso";
									}
								}
							}

							let jaksomaarat = "";
							if (replyObj[i].ajanjakson_jaksot > 0) {
								jaksomaarat =
									"Työjaksot: " +
									replyObj[i].naytettavat_jaksot +
									" / " +
									replyObj[i].ajanjakson_jaksot;
							} else {
								jaksomaarat = "Ei työjaksoja";
							}

							let id = replyObj[i].id;
							let reservitauludata =
								"<tr id='reservi_rivi_" +
								id +
								"'>" +
								"<td class='teksti_vasen'>" +
								"<img id='reservi_laajenna_" +
								id +
								"' src='css/imgs/laajenna.png' class='laajenna_kuvake' alt='Laajenna'/>" +
								"<span id='reservi_maara_" +
								id +
								"' class='reservimaara_teksti'>" +
								jaksomaarat +
								"</span>" +
								"<div id='reservi_tarkistus_" +
								id +
								"' class='reservi_tarkistuskehys'>" +
								tyojakso_tarkistus +
								"</div>" +
								"</td>" +
								"<td class='teksti_keskella'><span id='reservi_vakanssinumero_" +
								id +
								"'>" +
								replyObj[i].vakanssinumero +
								"</span></td>" +
								"<td class='teksti_keskella'><span id='reservi_nimi_" +
								id +
								"'>" +
								replyObj[i].nimi +
								"</span></td>" +
								"<td class='teksti_keskella'><span id='reservi_nimike_" +
								id +
								"'>" +
								replyObj[i].nimike +
								"</span></td>" +
								"</tr>" +
								"<tr>" +
								"<td colspan='4'>" +
								"<div id='reservi_rivi_lapsitaulu_kehys_" +
								id +
								"' class='piilotettu reservi_lapsitaulu_kehys'>" +
								"<table>" +
								"<thead>" +
								"<th id='reservi_rivi_lapsitaulu_osasto_" +
								id +
								"' class='teksti_keskella'>Osasto</th>" +
								"<th id='reservi_rivi_lapsitaulu_alkupvm_" +
								id +
								"' class='teksti_keskella'>Alku pvm</th>" +
								"<th id='reservi_rivi_lapsitaulu_loppupvm_" +
								id +
								"' class='teksti_keskella'>Loppu pvm</th>" +
								"<th id='reservi_rivi_lapsitaulu_tyomaara_" +
								id +
								"' class='lyhyt teksti_keskella'>Työmäärä</th>" +
								"<th id='reservi_rivi_lapsitaulu_tausta_" +
								id +
								"' class='teksti_keskella'>Reservitausta</th>" +
								"<th id='reservi_rivi_lapsitaulu_kommentti_" +
								id +
								"' class='teksti_keskella'>Kommentti</th>" +
								"<th><span id='reservi_rivi_lapsitaulu_jarjestysarvo_" +
								id +
								"' class='piilotettu'>alku_pvm</span><span id='reservi_rivi_lapsitaulu_jarjestys_" +
								id +
								"' class='piilotettu'>ASC</span></th>" +
								"<th></th>" +
								"</thead>" +
								"<tbody id='reservi_rivi_lapsitaulu_" +
								id +
								"' class='reservi_rivi_lapsitaulu_tiedot'>" +
								"</tbody>" +
								"</table>" +
								"</div>" +
								"</td>" +
								"</tr>";

							$("#reservitauludata").append(reservitauludata);

							$("#reservi_rivi_lapsitaulu_osasto_" + id).click(function () {
								let id = $(this)
									.prop("id")
									.replace("reservi_rivi_lapsitaulu_osasto_", "");
								reservi_aseta_tyojakso_jarjestys(id, "osasto");
							});

							$("#reservi_rivi_lapsitaulu_alkupvm_" + id).click(function () {
								let id = $(this)
									.prop("id")
									.replace("reservi_rivi_lapsitaulu_alkupvm_", "");
								reservi_aseta_tyojakso_jarjestys(id, "alku_pvm");
							});

							$("#reservi_rivi_lapsitaulu_loppupvm_" + id).click(function () {
								let id = $(this)
									.prop("id")
									.replace("reservi_rivi_lapsitaulu_loppupvm_", "");
								reservi_aseta_tyojakso_jarjestys(id, "loppu_pvm");
							});

							$("#reservi_rivi_lapsitaulu_tyomaara_" + id).click(function () {
								let id = $(this)
									.prop("id")
									.replace("reservi_rivi_lapsitaulu_tyomaara_", "");
								reservi_aseta_tyojakso_jarjestys(id, "prosentti");
							});

							$("#reservi_rivi_lapsitaulu_tausta_" + id).click(function () {
								let id = $(this)
									.prop("id")
									.replace("reservi_rivi_lapsitaulu_tausta_", "");
								reservi_aseta_tyojakso_jarjestys(id, "reservitausta");
							});

							$("#reservi_rivi_lapsitaulu_kommentti_" + id).click(function () {
								let id = $(this)
									.prop("id")
									.replace("reservi_rivi_lapsitaulu_kommentti_", "");
								reservi_aseta_tyojakso_jarjestys(id, "kommentti");
							});

							$("#reservi_laajenna_" + id).click(function () {
								let id = $(this).prop("id").replace("reservi_laajenna_", "");

								if (
									$("#reservi_rivi_lapsitaulu_kehys_" + id).hasClass(
										"piilotettu"
									)
								) {
									$("#reservi_rivi_lapsitaulu_kehys_" + id).removeClass(
										"piilotettu"
									);
									$("#reservi_rivi_lapsitaulu_kehys_" + id).slideDown("slow");
									hae_reservilaisen_tyojaksot(id);
									$("#reservi_rivi_" + id).addClass("valittu_reservi_rivi");
								} else {
									$("#reservi_rivi_lapsitaulu_kehys_" + id).slideUp(
										"slow",
										function () {
											$(".valittu_reservi_rivi").removeClass(
												"valittu_reservi_rivi"
											);
											$("#reservi_rivi_lapsitaulu_kehys_" + id).addClass(
												"piilotettu"
											);
										}
									);
								}
							});
						}
				}
			}
		}
	);
}

function reservi_aseta_tyojakso_jarjestys(id, jarjestysarvo) {
	if (
		$("#reservi_rivi_lapsitaulu_jarjestysarvo_" + id).html() == jarjestysarvo
	) {
		if ($("#reservi_rivi_lapsitaulu_jarjestys_" + id).html() == "DESC") {
			$("#reservi_rivi_lapsitaulu_jarjestys_" + id).html("ASC");
		} else {
			$("#reservi_rivi_lapsitaulu_jarjestys_" + id).html("DESC");
		}
	} else {
		$("#reservi_rivi_lapsitaulu_jarjestysarvo_" + id).html(jarjestysarvo);
		$("#reservi_rivi_lapsitaulu_jarjestys_" + id).html("ASC");
	}

	hae_reservilaisen_tyojaksot(id);
}

function hae_reservilaisen_tyojaksot(re_reservilainen_id) {
	let re_alku_pvm = $.datepicker.formatDate(
		"dd.mm.yy",
		$("#reservi_alku_pvm").datepicker("getDate")
	);
	let re_loppu_pvm = $.datepicker.formatDate(
		"dd.mm.yy",
		$("#reservi_loppu_pvm").datepicker("getDate")
	);
	let re_varoitustila = 1;
	if ($("#reservi_varoitusvalinta").prop("checked") == false) {
		re_varoitustila = 0;
	}
	let re_hakusana = $("#reservi_tyojaksohaku_hakusana").val();
	let re_arvo = $("#reservi_tyojaksohaku_haettavaarvo").val();
	let re_jarjestys = $(
		"#reservi_rivi_lapsitaulu_jarjestys_" + re_reservilainen_id
	).html();
	let re_jarjestysarvo = $(
		"#reservi_rivi_lapsitaulu_jarjestysarvo_" + re_reservilainen_id
	).html();

	if ($("#latausnakyma").css("display") == "none") {
		$("#reservilatausRuutu").dialog("open");
	}

	$("#reservi_rivi_lapsitaulu_" + re_reservilainen_id).html(
		"<tr id='reservi_rivi_lapsitaulu_lisaysrivi_" +
			re_reservilainen_id +
			"' class='reservi_lisaysrivi'>" +
			"<td class='teksti_keskella'><select id='reservi_osasto_lisaysrivi_" +
			re_reservilainen_id +
			"' title='Osasto' class='valintakentta reservi_valinta'></select></td>" +
			"<td class='teksti_keskella'><input id='reservi_alku_pvm_lisaysrivi_" +
			re_reservilainen_id +
			"' class='pvm_kentta' readonly /></td>" +
			"<td class='teksti_keskella'><input id='reservi_loppu_pvm_lisaysrivi_" +
			re_reservilainen_id +
			"' class='pvm_kentta' readonly /></td>" +
			"<td class='teksti_keskella'><select id='reservi_tyomaara_lisaysrivi_" +
			re_reservilainen_id +
			"' title='Työmäärä %' class='valintakentta reservi_valinta'></select></td>" +
			"<td class='teksti_keskella'><select id='reservi_reservitausta_lisaysrivi_" +
			re_reservilainen_id +
			"' title='Reservitausta' class='valintakentta reservi_valinta'></select></td>" +
			"<td class='teksti_keskella'><input id='reservi_kommentti_lisaysrivi_" +
			re_reservilainen_id +
			"' class='reservi_kommenttikentta'/></td>" +
			"<td class='teksti_keskella'><button id='reservi_tallenna_lisaysrivi_" +
			re_reservilainen_id +
			"' class='reservi_tallennapainike piilonakyvissa'>Tallenna</button></td>" +
			"<td class='teksti_keskella'></td>" +
			"</tr>"
	);

	$("#reservi_tallenna_lisaysrivi_" + re_reservilainen_id).click(function () {
		reservi_tallenna_tyojakso(
			$(this).prop("id").replace("reservi_tallenna_lisaysrivi_", ""),
			0
		);
	});

	$("#reservi_osasto_lisaysrivi_" + re_reservilainen_id).html("");
	$("#reservi_osasto_lisaysrivi_" + re_reservilainen_id).append(
		reservi_osasto_valinnat
	);
	$("#reservi_osasto_lisaysrivi_" + re_reservilainen_id).val(0);
	$("#reservi_osasto_lisaysrivi_" + re_reservilainen_id).change(function () {
		if (
			!$(
				"#reservi_rivi_lapsitaulu_lisaysrivi_" +
					$(this).prop("id").replace("reservi_osasto_lisaysrivi_", "")
			).hasClass("reservi_rivi_muutettu")
		) {
			$(
				"#reservi_rivi_lapsitaulu_lisaysrivi_" +
					$(this).prop("id").replace("reservi_osasto_lisaysrivi_", "")
			).addClass("reservi_rivi_muutettu", 500);
		}
		if (
			$(
				"#reservi_tallenna_lisaysrivi_" +
					$(this).prop("id").replace("reservi_osasto_lisaysrivi_", "")
			).hasClass("piilonakyvissa")
		) {
			$(
				"#reservi_tallenna_lisaysrivi_" +
					$(this).prop("id").replace("reservi_osasto_lisaysrivi_", "")
			).removeClass("piilonakyvissa", 500);
		}
	});

	$("#reservi_alku_pvm_lisaysrivi_" + re_reservilainen_id).datepicker({
		dateFormat: "dd.mm.yy",
		regional: "fi",
		showOtherMonths: true,
		numberOfMonths: 1,
		showWeek: true,
		onSelect: function (dateText, inst) {
			$(
				"#reservi_loppu_pvm_lisaysrivi_" +
					$(this).prop("id").replace("reservi_alku_pvm_lisaysrivi_", "")
			).datepicker("option", "minDate", dateText);
			if (
				!$(
					"#reservi_rivi_lapsitaulu_lisaysrivi_" +
						$(this).prop("id").replace("reservi_alku_pvm_lisaysrivi_", "")
				).hasClass("reservi_rivi_muutettu")
			) {
				$(
					"#reservi_rivi_lapsitaulu_lisaysrivi_" +
						$(this).prop("id").replace("reservi_alku_pvm_lisaysrivi_", "")
				).addClass("reservi_rivi_muutettu", 500);
			}
			if (
				$(
					"#reservi_tallenna_lisaysrivi_" +
						$(this).prop("id").replace("reservi_alku_pvm_lisaysrivi_", "")
				).hasClass("piilonakyvissa")
			) {
				$(
					"#reservi_tallenna_lisaysrivi_" +
						$(this).prop("id").replace("reservi_alku_pvm_lisaysrivi_", "")
				).removeClass("piilonakyvissa", 500);
			}
		},
	});

	$("#reservi_loppu_pvm_lisaysrivi_" + re_reservilainen_id).datepicker({
		dateFormat: "dd.mm.yy",
		regional: "fi",
		showOtherMonths: true,
		numberOfMonths: 1,
		showWeek: true,
		onSelect: function (dateText, inst) {
			$(
				"#reservi_alku_pvm_lisaysrivi_" +
					$(this).prop("id").replace("reservi_loppu_pvm_lisaysrivi_", "")
			).datepicker("option", "maxDate", dateText);
			if (
				!$(
					"#reservi_rivi_lapsitaulu_lisaysrivi_" +
						$(this).prop("id").replace("reservi_loppu_pvm_lisaysrivi_", "")
				).hasClass("reservi_rivi_muutettu")
			) {
				$(
					"#reservi_rivi_lapsitaulu_lisaysrivi_" +
						$(this).prop("id").replace("reservi_loppu_pvm_lisaysrivi_", "")
				).addClass("reservi_rivi_muutettu", 500);
			}
			if (
				$(
					"#reservi_tallenna_lisaysrivi_" +
						$(this).prop("id").replace("reservi_loppu_pvm_lisaysrivi_", "")
				).hasClass("piilonakyvissa")
			) {
				$(
					"#reservi_tallenna_lisaysrivi_" +
						$(this).prop("id").replace("reservi_loppu_pvm_lisaysrivi_", "")
				).removeClass("piilonakyvissa", 500);
			}
		},
	});

	$("#reservi_tyomaara_lisaysrivi_" + re_reservilainen_id).html("");
	$("#reservi_tyomaara_lisaysrivi_" + re_reservilainen_id).append(
		reservi_tyomaara_valinnat
	);
	$("#reservi_tyomaara_lisaysrivi_" + re_reservilainen_id).val(0);
	$("#reservi_tyomaara_lisaysrivi_" + re_reservilainen_id).change(function () {
		if (
			!$(
				"#reservi_rivi_lapsitaulu_lisaysrivi_" +
					$(this).prop("id").replace("reservi_tyomaara_lisaysrivi_", "")
			).hasClass("reservi_rivi_muutettu")
		) {
			$(
				"#reservi_rivi_lapsitaulu_lisaysrivi_" +
					$(this).prop("id").replace("reservi_tyomaara_lisaysrivi_", "")
			).addClass("reservi_rivi_muutettu", 500);
		}
		if (
			$(
				"#reservi_tallenna_lisaysrivi_" +
					$(this).prop("id").replace("reservi_tyomaara_lisaysrivi_", "")
			).hasClass("piilonakyvissa")
		) {
			$(
				"#reservi_tallenna_lisaysrivi_" +
					$(this).prop("id").replace("reservi_tyomaara_lisaysrivi_", "")
			).removeClass("piilonakyvissa", 500);
		}
	});

	$("#reservi_reservitausta_lisaysrivi_" + re_reservilainen_id).html("");
	$("#reservi_reservitausta_lisaysrivi_" + re_reservilainen_id).append(
		reservi_reservitausta_valinnat
	);
	$("#reservi_reservitausta_lisaysrivi_" + re_reservilainen_id).val(0);
	$("#reservi_reservitausta_lisaysrivi_" + re_reservilainen_id).change(
		function () {
			if (
				!$(
					"#reservi_rivi_lapsitaulu_lisaysrivi_" +
						$(this).prop("id").replace("reservi_reservitausta_lisaysrivi_", "")
				).hasClass("reservi_rivi_muutettu")
			) {
				$(
					"#reservi_rivi_lapsitaulu_lisaysrivi_" +
						$(this).prop("id").replace("reservi_reservitausta_lisaysrivi_", "")
				).addClass("reservi_rivi_muutettu", 500);
			}
			if (
				$(
					"#reservi_tallenna_lisaysrivi_" +
						$(this).prop("id").replace("reservi_reservitausta_lisaysrivi_", "")
				).hasClass("piilonakyvissa")
			) {
				$(
					"#reservi_tallenna_lisaysrivi_" +
						$(this).prop("id").replace("reservi_reservitausta_lisaysrivi_", "")
				).removeClass("piilonakyvissa", 500);
			}
		}
	);

	$("#reservi_kommentti_lisaysrivi_" + re_reservilainen_id).change(function () {
		if (
			!$(
				"#reservi_rivi_lapsitaulu_lisaysrivi_" +
					$(this).prop("id").replace("reservi_kommentti_lisaysrivi_", "")
			).hasClass("reservi_rivi_muutettu")
		) {
			$(
				"#reservi_rivi_lapsitaulu_lisaysrivi_" +
					$(this).prop("id").replace("reservi_kommentti_lisaysrivi_", "")
			).addClass("reservi_rivi_muutettu", 500);
		}
		if (
			$(
				"#reservi_tallenna_lisaysrivi_" +
					$(this).prop("id").replace("reservi_kommentti_lisaysrivi_", "")
			).hasClass("piilonakyvissa")
		) {
			$(
				"#reservi_tallenna_lisaysrivi_" +
					$(this).prop("id").replace("reservi_kommentti_lisaysrivi_", "")
			).removeClass("piilonakyvissa", 500);
		}
	});

	$.post(
		"php/hae_reservilaisen_tyojaksot.php",
		{
			reservilainen_id: re_reservilainen_id,
			alku_pvm: re_alku_pvm,
			loppu_pvm: re_loppu_pvm,
			varoitus: re_varoitustila,
			hakusana: re_hakusana,
			haettavaarvo: re_arvo,
			jarjestys: re_jarjestys,
			jarjestettavaarvo: re_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				$("#reservilatausRuutu").dialog("close");
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						$("#reservilatausRuutu").dialog("close");
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#reservilatausRuutu").dialog("close");

						let tyojakso_tarkistus = "";
						let alittuvat_tyomaara_tiedot =
							replyObj[0].alittuvat_tyomaara_tiedot;
						for (let tyomaara in alittuvat_tyomaara_tiedot) {
							if ($("#reservi_varoitusvalinta").prop("checked")) {
								tyojakso_tarkistus +=
									"<img src='css/imgs/varoitus.png' class='varoitus_kuvake' alt='Tyomäärä alittuu'/>" +
									tyomaara +
									"%";
							} else {
								if (alittuvat_tyomaara_tiedot[tyomaara] > 1) {
									tyojakso_tarkistus +=
										"<img src='css/imgs/varoitus.png' class='varoitus_kuvake' alt='Tyomäärä alittuu'/>" +
										tyomaara +
										"% / " +
										alittuvat_tyomaara_tiedot[tyomaara] +
										" jaksoa";
								} else {
									tyojakso_tarkistus +=
										"<img src='css/imgs/varoitus.png' class='varoitus_kuvake' alt='Tyomäärä alittuu'/>" +
										tyomaara +
										"% / " +
										alittuvat_tyomaara_tiedot[tyomaara] +
										" jakso";
								}
							}
						}

						$("#reservi_tarkistus_" + re_reservilainen_id).html(
							tyojakso_tarkistus
						);
						let jaksomaarat = "";
						if (replyObj[0].ajanjakson_jaksot > 0) {
							jaksomaarat =
								"Työjaksot: " +
								replyObj[0].naytettavat_jaksot +
								" / " +
								replyObj[0].ajanjakson_jaksot;
						} else {
							jaksomaarat = "Ei työjaksoja";
						}

						$("#reservi_maara_" + re_reservilainen_id).html(jaksomaarat);

						for (let i = 1; i < replyObj.length; i++) {
							let reservipoisto = "";
							let id = replyObj[i].id;
							if (reservihallinta) {
								reservipoisto =
									"<img id='reservi_poisto_" +
									id +
									"' src='css/imgs/poista.png' class='poisto_kuvake' alt='Poista'/>";
							}
							let reservitauludata =
								"<tr id='reservi_rivi_lapsitaulu_rivi_" +
								id +
								"'>" +
								"<td class='teksti_keskella'><select id='reservi_osasto_" +
								id +
								"' title='Osasto' class='valintakentta reservi_valinta'></select></td>" +
								"<td class='teksti_keskella'><input id='reservi_alku_pvm_" +
								id +
								"' class='pvm_kentta' readonly /></td>" +
								"<td class='teksti_keskella'><input id='reservi_loppu_pvm_" +
								id +
								"' class='pvm_kentta' readonly /></td>" +
								"<td class='teksti_keskella'><select id='reservi_tyomaara_" +
								id +
								"' title='Työmäärä %' class='valintakentta reservi_valinta'></select></td>" +
								"<td class='teksti_keskella'><select id='reservi_reservitausta_" +
								id +
								"' title='Reservitausta' class='valintakentta reservi_valinta'></select></td>" +
								"<td class='teksti_keskella'><input id='reservi_kommentti_" +
								id +
								"' class='reservi_kommenttikentta' value='" +
								replyObj[i].kommentti +
								"' /></td>" +
								"<td class='teksti_keskella'><button id='reservi_tallenna_" +
								id +
								"' class='reservi_tallennapainike piilonakyvissa'>Päivitä</button></td>" +
								"<td class='teksti_keskella'>" +
								reservipoisto +
								"</td>" +
								"</tr>";

							$("#reservi_rivi_lapsitaulu_" + re_reservilainen_id).append(
								reservitauludata
							);

							if (reservihallinta) {
								$("#reservi_poisto_" + id).click(function () {
									let reservilais_id = $(this)
										.closest(".reservi_rivi_lapsitaulu_tiedot")
										.prop("id")
										.replace("reservi_rivi_lapsitaulu_", "");
									reservi_nayta_tyojaksonpoisto(
										reservilais_id,
										$(this).prop("id").replace("reservi_poisto_", "")
									);
								});
							}

							$("#reservi_tallenna_" + id).click(function () {
								let reservilais_id = $(this)
									.closest(".reservi_rivi_lapsitaulu_tiedot")
									.prop("id")
									.replace("reservi_rivi_lapsitaulu_", "");
								reservi_tallenna_tyojakso(
									reservilais_id,
									$(this).prop("id").replace("reservi_tallenna_", "")
								);
							});

							$("#reservi_osasto_" + id).html("");
							$("#reservi_osasto_" + id).append(reservi_osasto_valinnat);
							$("#reservi_osasto_" + id).val(replyObj[i].osasto_id);
							$("#reservi_osasto_" + id).change(function () {
								if (
									!$(
										"#reservi_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("reservi_osasto_", "")
									).hasClass("reservi_rivi_muutettu")
								) {
									$(
										"#reservi_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("reservi_osasto_", "")
									).addClass("reservi_rivi_muutettu", 500);
								}
								if (
									$(
										"#reservi_tallenna_" +
											$(this).prop("id").replace("reservi_osasto_", "")
									).hasClass("piilonakyvissa")
								) {
									$(
										"#reservi_tallenna_" +
											$(this).prop("id").replace("reservi_osasto_", "")
									).removeClass("piilonakyvissa", 500);
								}
							});

							$("#reservi_alku_pvm_" + id).datepicker({
								dateFormat: "dd.mm.yy",
								regional: "fi",
								showOtherMonths: true,
								numberOfMonths: 1,
								showWeek: true,
								onSelect: function (dateText, inst) {
									$(
										"#reservi_loppu_pvm_" +
											$(this).prop("id").replace("reservi_alku_pvm_", "")
									).datepicker("option", "minDate", dateText);
									if (
										!$(
											"#reservi_rivi_lapsitaulu_rivi_" +
												$(this).prop("id").replace("reservi_alku_pvm_", "")
										).hasClass("reservi_rivi_muutettu")
									) {
										$(
											"#reservi_rivi_lapsitaulu_rivi_" +
												$(this).prop("id").replace("reservi_alku_pvm_", "")
										).addClass("reservi_rivi_muutettu", 500);
									}
									if (
										$(
											"#reservi_tallenna_" +
												$(this).prop("id").replace("reservi_alku_pvm_", "")
										).hasClass("piilonakyvissa")
									) {
										$(
											"#reservi_tallenna_" +
												$(this).prop("id").replace("reservi_alku_pvm_", "")
										).removeClass("piilonakyvissa", 500);
									}
								},
							});

							$("#reservi_loppu_pvm_" + id).datepicker({
								dateFormat: "dd.mm.yy",
								regional: "fi",
								showOtherMonths: true,
								numberOfMonths: 1,
								showWeek: true,
								onSelect: function (dateText, inst) {
									$(
										"#reservi_alku_pvm_" +
											$(this).prop("id").replace("reservi_loppu_pvm_", "")
									).datepicker("option", "maxDate", dateText);
									if (
										!$(
											"#reservi_rivi_lapsitaulu_rivi_" +
												$(this).prop("id").replace("reservi_loppu_pvm_", "")
										).hasClass("reservi_rivi_muutettu")
									) {
										$(
											"#reservi_rivi_lapsitaulu_rivi_" +
												$(this).prop("id").replace("reservi_loppu_pvm_", "")
										).addClass("reservi_rivi_muutettu", 500);
									}
									if (
										$(
											"#reservi_tallenna_" +
												$(this).prop("id").replace("reservi_loppu_pvm_", "")
										).hasClass("piilonakyvissa")
									) {
										$(
											"#reservi_tallenna_" +
												$(this).prop("id").replace("reservi_loppu_pvm_", "")
										).removeClass("piilonakyvissa", 500);
									}
								},
							});

							$("#reservi_alku_pvm_" + id).val(replyObj[i].alku_pvm);
							$("#reservi_loppu_pvm_" + id).datepicker(
								"option",
								"minDate",
								replyObj[i].alku_pvm
							);
							$("#reservi_loppu_pvm_" + id).val(replyObj[i].loppu_pvm);
							$("#reservi_alku_pvm_" + id).datepicker(
								"option",
								"maxDate",
								replyObj[i].loppu_pvm
							);

							$("#reservi_tyomaara_" + id).html("");
							$("#reservi_tyomaara_" + id).append(reservi_tyomaara_valinnat);
							$("#reservi_tyomaara_" + id).val(replyObj[i].tyomaara_id);
							$("#reservi_tyomaara_" + id).change(function () {
								if (
									!$(
										"#reservi_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("reservi_tyomaara_", "")
									).hasClass("reservi_rivi_muutettu")
								) {
									$(
										"#reservi_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("reservi_tyomaara_", "")
									).addClass("reservi_rivi_muutettu", 500);
								}
								if (
									$(
										"#reservi_tallenna_" +
											$(this).prop("id").replace("reservi_tyomaara_", "")
									).hasClass("piilonakyvissa")
								) {
									$(
										"#reservi_tallenna_" +
											$(this).prop("id").replace("reservi_tyomaara_", "")
									).removeClass("piilonakyvissa", 500);
								}
							});

							$("#reservi_reservitausta_" + id).html("");
							$("#reservi_reservitausta_" + id).append(
								reservi_reservitausta_valinnat
							);
							$("#reservi_reservitausta_" + id).val(
								replyObj[i].reservitausta_id
							);
							$("#reservi_reservitausta_" + id).change(function () {
								if (
									!$(
										"#reservi_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("reservi_reservitausta_", "")
									).hasClass("reservi_rivi_muutettu")
								) {
									$(
										"#reservi_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("reservi_reservitausta_", "")
									).addClass("reservi_rivi_muutettu", 500);
								}
								if (
									$(
										"#reservi_tallenna_" +
											$(this).prop("id").replace("reservi_reservitausta_", "")
									).hasClass("piilonakyvissa")
								) {
									$(
										"#reservi_tallenna_" +
											$(this).prop("id").replace("reservi_reservitausta_", "")
									).removeClass("piilonakyvissa", 500);
								}
							});

							$("#reservi_kommentti_" + id).change(function () {
								if (
									!$(
										"#reservi_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("reservi_kommentti_", "")
									).hasClass("reservi_rivi_muutettu")
								) {
									$(
										"#reservi_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("reservi_kommentti_", "")
									).addClass("reservi_rivi_muutettu", 500);
								}
								if (
									$(
										"#reservi_tallenna_" +
											$(this).prop("id").replace("reservi_kommentti_", "")
									).hasClass("piilonakyvissa")
								) {
									$(
										"#reservi_tallenna_" +
											$(this).prop("id").replace("reservi_kommentti_", "")
									).removeClass("piilonakyvissa", 500);
								}
							});
						}

						$(
							"#reservi_rivi_lapsitaulu_kehys_" +
								re_reservilainen_id +
								" button"
						).button();
						$("#reservilatausRuutu").dialog("close");
				}
			}
		}
	);
}

function reservi_tallenna_tyojakso(tj_reservilainen_id, tj_tyojakso_id) {
	let tj_osasto_id = "";
	let tj_alku_pvm = "";
	let tj_loppu_pvm = "";
	let tj_tyomaara_id = "";
	let tj_reservitausta_id = "";
	let tj_kommentti = "";

	let tyojakso_alku_pvm = "";
	let tyojakso_loppu_pvm = "";

	if (tj_tyojakso_id == 0) {
		tj_osasto_id = $("#reservi_osasto_lisaysrivi_" + tj_reservilainen_id).val();
		tj_alku_pvm = $(
			"#reservi_alku_pvm_lisaysrivi_" + tj_reservilainen_id
		).val();
		tyojakso_alku_pvm = $(
			"#reservi_alku_pvm_lisaysrivi_" + tj_reservilainen_id
		).datepicker("getDate");
		tj_loppu_pvm = $(
			"#reservi_loppu_pvm_lisaysrivi_" + tj_reservilainen_id
		).val();
		tyojakso_loppu_pvm = $(
			"#reservi_loppu_pvm_lisaysrivi_" + tj_reservilainen_id
		).datepicker("getDate");
		tj_tyomaara_id = $(
			"#reservi_tyomaara_lisaysrivi_" + tj_reservilainen_id
		).val();
		tj_reservitausta_id = $(
			"#reservi_reservitausta_lisaysrivi_" + tj_reservilainen_id
		).val();
		tj_kommentti = $(
			"#reservi_kommentti_lisaysrivi_" + tj_reservilainen_id
		).val();
	} else {
		tj_osasto_id = $("#reservi_osasto_" + tj_tyojakso_id).val();
		tj_alku_pvm = $("#reservi_alku_pvm_" + tj_tyojakso_id).val();
		tyojakso_alku_pvm = $("#reservi_alku_pvm_" + tj_tyojakso_id).datepicker(
			"getDate"
		);
		tj_loppu_pvm = $("#reservi_loppu_pvm_" + tj_tyojakso_id).val();
		tyojakso_loppu_pvm = $("#reservi_loppu_pvm_" + tj_tyojakso_id).datepicker(
			"getDate"
		);
		tj_tyomaara_id = $("#reservi_tyomaara_" + tj_tyojakso_id).val();
		tj_reservitausta_id = $("#reservi_reservitausta_" + tj_tyojakso_id).val();
		tj_kommentti = $("#reservi_kommentti_" + tj_tyojakso_id).val();
	}

	if (
		tj_osasto_id == 0 ||
		tj_alku_pvm == "" ||
		tj_loppu_pvm == "" ||
		tj_tyomaara_id == 0 ||
		tj_reservitausta_id == 0
	) {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_tyojakso.php",
		{
			reservilainen_id: tj_reservilainen_id,
			tyojakso_id: tj_tyojakso_id,
			osasto_id: tj_osasto_id,
			alku_pvm: tj_alku_pvm,
			loppu_pvm: tj_loppu_pvm,
			tyomaara_id: tj_tyomaara_id,
			reservitausta_id: tj_reservitausta_id,
			kommentti: tj_kommentti,
		},
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				if (replyObj[0].virhe == "yli") {
					let viesti =
						"Työjaksojen työmäärä ylittää 100% (" + replyObj[0].viesti + ")";
					alert(viesti);
					if (tj_tyojakso_id == 1) {
						hae_reservilaisen_tyojaksot(tj_reservilainen_id);
					}
				} else {
					nayta_tilaviesti("Työjakson tallennus onnistui");
					$("#reservi_tyojaksohaku_hakusana").val("");
					$("#reservi_reservilaishaku_hakusana").val("");

					if (
						$("#reservi_alku_pvm").val() != "" ||
						$("#reservi_loppu_pvm") != ""
					) {
						if ($("#reservi_alku_pvm").val() != "") {
							let nakyma_alku_pvm =
								$("#reservi_alku_pvm").datepicker("getDate");
							if (tyojakso_loppu_pvm < nakyma_alku_pvm) {
								$("#reservi_alku_pvm").val(tj_loppu_pvm);
							}
						}
						if ($("#reservi_loppu_pvm").val() != "") {
							let nakyma_loppu_pvm =
								$("#reservi_loppu_pvm").datepicker("getDate");
							if (tyojakso_alku_pvm > nakyma_loppu_pvm) {
								$("#reservi_loppu_pvm").val(tj_alku_pvm);
							}
						}
					}

					hae_reservilaisen_tyojaksot(tj_reservilainen_id);
				}
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function reservi_nayta_tyojaksonpoisto(reservilais_id, tj_id) {
	$("#reservi_poisto_teksti").html(
		"Poistetaanko reserviläisen työjakso " +
			$("#reservi_alku_pvm_" + tj_id).val() +
			" - " +
			$("#reservi_loppu_pvm_" + tj_id).val() +
			" ?"
	);
	$("#reservi_poisto_reservilainen_id").html(reservilais_id);
	$("#reservi_poisto_id").html(tj_id);
	$("#reservipoistoRuutu").dialog("open");
}

function reservi_poista_tyojakso() {
	let tj_id = $("#reservi_poisto_id").html();
	let reservilainen_id = $("#reservi_poisto_reservilainen_id").html();

	$.post("php/poista_tyojakso.php", { id: tj_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			$("#reservi_poisto_id").html("");
			$("#reservi_poisto_reservilainen_id").html("");
			$("#reservipoistoRuutu").dialog("close");
			hae_reservilaisen_tyojaksot(reservilainen_id);
		} else {
			alert("Tietokantavirhe");
		}
	});
}

/******************* SIHTEERINÄKYMÄ **********************************/

function alusta_sihteerinakyma() {
	if (!sihteerinakyma_alustettu) {
		//Kalentereiden alustus
		$("#sihteeri_alku_pvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (dateText, inst) {
				$("#sihteeri_loppu_pvm").datepicker("option", "minDate", dateText);
				sihteeri_hae_sihteerit();
			},
		});

		//Aseta pvm_kentta tyhjennys del (46) tai backspace (8) näppäimestä
		$("#sihteeri_alku_pvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#sihteeri_alku_pvm"));
			}
		});

		$("#sihteeri_loppu_pvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (dateText, inst) {
				$("#sihteeri_alku_pvm").datepicker("option", "maxDate", dateText);
				sihteeri_hae_sihteerit();
			},
		});

		//Aseta pvm_kentta tyhjennys del (46) tai backspace (8) näppäimestä
		$("#sihteeri_loppu_pvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#sihteeri_loppu_pvm"));
			}
		});

		$("#sihteeri_sihteerihaku_hakusana").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 13) {
				sihteeri_hae_sihteerit();
			}
		});

		$("#sihteeri_tyojaksohaku_hakusana").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 13) {
				sihteeri_hae_sihteerit();
			}
		});

		$("#sihteeripalvelualuesuodatin").change(function () {
			sihteeri_hae_sihteerit();
		});

		//Alustaa latausruudun
		$("#sihteerilatausRuutu").dialog({
			autoOpen: false,
			title: "Haetaan työjaksoja...",
			width: 350,
			dialogClass: "ei_sulku_painiketta",
		});

		//Alustaa poistoruudun
		$("#sihteeripoistoRuutu").dialog({
			modal: true,
			autoOpen: false,
			width: 650,
			title: "Poista työjakso",
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						sihteeri_poista_tyojakso();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		sihteerinakyma_alustettu = true;
	}

	let tanaan = new Date();

	$("#sihteeripalvelualuesuodatin").html("");
	$("#sihteeripalvelualuepikavalinnat").html("");
	$("#sihteerinakyma input").val("");
	$("#sihteeri_haku_valikko").val("nimi");
	$("#sihteeri_poisto_id").html("");
	$("#sihteeri_poisto_teksti").html("");
	$("#sihteeri_haku_painike").button("option", "disabled", false);
	$("#sihteeritauludata").html("");
	$.datepicker._clearDate($("#sihteeri_alku_pvm"));
	$.datepicker._clearDate($("#sihteeri_loppu_pvm"));
	$("#sihteeri_alku_pvm").val("01.01." + tanaan.getFullYear());
	$("#sihteeri_sihteerithaku_haettavaarvo").val("nimi");
	$("#sihteeri_tyojaksohaku_haettavaarvo").prop("selectedIndex", 0);
	$("#sihteeri_varoitusvalinta").prop("checked", true);
	$("#sihteeri_alanakyma").css("background-color", "#deedf7");
	sihteeri_kustannusnumero_valinnat = "";

	//Suorittaa $.post kutsut, kun kaikki kutsut on valmiita, kutsu funktiota
	$.when(
		sihteeri_hae_osasto_valinnat(),
		sihteeri_hae_tyomaara_valinnat(),
		sihteeri_hae_tausta_valinnat(),
		sihteeri_hae_palvelualue_valinnat()
	).then(function () {
		sihteeri_hae_sihteerit();
	});
}

function sihteeri_hae_palvelualue_valinnat() {
	$("#sihteeripalvelualuesuodatin").html("");
	$("#sihteeripalvelualuepikavalinnat").html(
		"<button id='sihteeripalvelualuevalinta_0' class='palvelualuepainike'>Kaikki</button>"
	);

	$("#sihteeripalvelualuevalinta_0").click(function () {
		$("#sihteeripalvelualuepikavalinnat button").removeClass(
			"painike_valittu_tila"
		);
		$(this).addClass("painike_valittu_tila");
		$("#sihteeripalvelualuesuodatin").prop("selected", "selected");
		sihteeri_hae_sihteerit();
	});

	sihteeri_kustannusnumero_valinnat = "<option value='0'>Valitse</option>";

	let valmis = $.Deferred();
	let haettavat_palvelualue_idt = -1;

	$.post(
		"php/hae_palvelualue_valinnat.php",
		{ palvelualue_idt: haettavat_palvelualue_idt },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);

				for (let i = 0; i < replyObj.length; i++) {
					$("#sihteeripalvelualuepikavalinnat").append(
						"<button id='sihteeripalvelualuevalinta_" +
							replyObj[i].id +
							"' class='palvelualuepainike'>" +
							replyObj[i].lyhenne +
							"</button>"
					);
					$("#sihteeripalvelualuesuodatin").append(
						"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].nimi +
							"</option>"
					);

					$("#sihteeripalvelualuevalinta_" + replyObj[i].id).click(function (
						painiketapahtuma
					) {
						let palvelualue_id = $(this)
							.prop("id")
							.replace("sihteeripalvelualuevalinta_", "");
						let valitut_palvelualue_idt = $(
							"#sihteeripalvelualuesuodatin"
						).val();

						if (
							$("#sihteeripalvelualuevalinta_0").hasClass(
								"painike_valittu_tila"
							) &&
							$("#sihteeripalvelualuesuodatin option").length ==
								valitut_palvelualue_idt.length
						) {
							$("#sihteeripalvelualuepikavalinnat button").removeClass(
								"painike_valittu_tila"
							);
							$("#sihteeripalvelualuesuodatin").val(palvelualue_id).change();
							$(this).addClass("painike_valittu_tila");
						} else {
							if (painiketapahtuma.ctrlKey == true) {
								if ($(this).hasClass("painike_valittu_tila")) {
									if (
										$("#sihteeripalvelualuepikavalinnat .painike_valittu_tila")
											.length > 1
									) {
										$(this).removeClass("painike_valittu_tila");
										if (valitut_palvelualue_idt.indexOf(palvelualue_id) >= 0) {
											valitut_palvelualue_idt.splice(
												valitut_palvelualue_idt.indexOf(palvelualue_id),
												1
											);
										}
										$("#sihteeripalvelualuesuodatin")
											.val(valitut_palvelualue_idt)
											.change();
									}
								} else {
									valitut_palvelualue_idt.push(palvelualue_id);
									$("#sihteeripalvelualuesuodatin")
										.val(valitut_palvelualue_idt)
										.change();
									if (
										$("#sihteeripalvelualuesuodatin option").length ==
										valitut_palvelualue_idt.length
									) {
										$("#sihteeripalvelualuepikavalinnat button").removeClass(
											"painike_valittu_tila"
										);
										$("#sihteeripalvelualuevalinta_0").addClass(
											"painike_valittu_tila"
										);
									} else {
										$(this).addClass("painike_valittu_tila");
									}
								}
							} else {
								$("#sihteeripalvelualuepikavalinnat button").removeClass(
									"painike_valittu_tila"
								);
								$("#sihteeripalvelualuesuodatin").val(palvelualue_id).change();
								$(this).addClass("painike_valittu_tila");
							}
						}
					});

					sihteeri_kustannusnumero_valinnat +=
						"<option value='" +
						replyObj[i].kustannusnumero +
						"'>(" +
						replyObj[i].kustannusnumero +
						") " +
						replyObj[i].nimi +
						"</option>";
				}

				$("#sihteeripalvelualuepikavalinnat button").button();
				$("#sihteeripalvelualuevalinta_0").addClass("painike_valittu_tila");
				$("#sihteeripalvelualuesuodatin option").prop("selected", "selected");
			} else {
				alert("Tietokantavirhe");
			}

			valmis.resolve();
		}
	);

	return valmis;
}

function sihteeri_hae_osasto_valinnat() {
	sihteeri_osasto_valinnat = "<option value='0'>Valitse</option>";

	let valmis = $.Deferred();

	$.post(
		"php/hae_osasto_valinnat.php",
		{ jarjestys: "lyhenne" },
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				if (replyObj.length > 0) {
					for (let i = 0; i < replyObj.length; i++) {
						let aktiivinen = "";
						if (replyObj[i].aktiivinen == 0) {
							aktiivinen = " disabled";
						}
						if (replyObj[i].toimialue_id != 0) {
							sihteeri_osasto_valinnat +=
								"<option value='" +
								replyObj[i].id +
								"'" +
								aktiivinen +
								">(" +
								replyObj[i].lyhenne +
								") " +
								replyObj[i].nimi +
								"</option>";
						}
					}
				}
			} else {
				alert("Tietokantavirhe");
			}

			valmis.resolve();
		}
	);

	return valmis;
}

function sihteeri_hae_tyomaara_valinnat() {
	sihteeri_tyomaara_valinnat = "<option value='0'>Valitse</option>";
	sihteeri_alijakso_tyomaara_valinnat = "<option value='0'>Valitse</option>";
	let valmis = $.Deferred();

	$.post("php/hae_tyomaara_valinnat.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			if (replyObj.length > 0) {
				for (let i = 0; i < replyObj.length; i++) {
					if (replyObj[i].prosentti == 100) {
						sihteeri_alijakso_tyomaara_valinnat +=
							"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].prosentti +
							"%</option>";
						sihteeri_tyomaara_valinnat +=
							"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].prosentti +
							"%</option>";
					} else {
						sihteeri_tyomaara_valinnat +=
							"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].prosentti +
							"%</option>";
					}
				}
			}
		} else {
			alert("Tietokantavirhe");
		}

		valmis.resolve();
	});

	return valmis;
}

function sihteeri_hae_tausta_valinnat() {
	sihteeri_tausta_valinnat =
		"<option value='0'>Valitse</option><option value='-1'>Vakituinen</option>";
	sihteeri_alijakso_tausta_valinnat = "<option value='0'>Valitse</option>";
	let valmis = $.Deferred();

	$.post("php/hae_sijaisuustausta_valinnat.php", function (reply) {
		if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			if (replyObj.length > 0) {
				for (let i = 0; i < replyObj.length; i++) {
					sihteeri_alijakso_tausta_valinnat +=
						"<option value='" +
						replyObj[i].id +
						"'>" +
						replyObj[i].numero +
						" = " +
						replyObj[i].selite +
						"</option>";
				}
			}
		} else {
			alert("Tietokantavirhe");
		}

		valmis.resolve();
	});

	return valmis;
}

function sihteeri_aseta_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == sihteeri_jarjestysarvo) {
		if (sihteeri_jarjestys == "DESC") {
			sihteeri_jarjestys = "ASC";
		} else {
			sihteeri_jarjestys = "DESC";
		}
	} else {
		sihteeri_jarjestysarvo = jarjestysarvo;
		sihteeri_jarjestys = "ASC";
	}

	sihteeri_hae_sihteerit();
}

function sihteeri_hae_sihteerit() {
	let sih_haku = $("#sihteeri_sihteerihaku_hakusana").val();
	let sih_arvo = $("#sihteeri_sihteerihaku_haettavaarvo").val();
	let sih_varoitustila = 1;
	if ($("#sihteeri_varoitusvalinta").prop("checked") == false) {
		sih_varoitustila = 0;
	}
	let sih_alue_idt = $("#sihteeripalvelualuesuodatin").val();

	let tj_alkupvm = $.datepicker.formatDate(
		"dd.mm.yy",
		$("#sihteeri_alku_pvm").datepicker("getDate")
	);
	let tj_loppupvm = $.datepicker.formatDate(
		"dd.mm.yy",
		$("#sihteeri_loppu_pvm").datepicker("getDate")
	);
	let tj_haku = $("#sihteeri_tyojaksohaku_hakusana").val();
	let tj_arvo = $("#sihteeri_tyojaksohaku_haettavaarvo").val();

	if (tj_haku != "" || sih_haku != "") {
		$("#sihteeri_alanakyma").css("background-color", "#fff7aa");
	} else {
		$("#sihteeri_alanakyma").css("background-color", "#deedf7");
	}

	$("#sihteeri_maara").html("0 sihteeriä");

	$.post(
		"php/hae_aktiiviset_sihteerit.php",
		{
			sih_hakusana: sih_haku,
			sih_haettavaarvo: sih_arvo,
			sih_varoitus: sih_varoitustila,
			sih_alue: sih_alue_idt,
			tj_alku_pvm: tj_alkupvm,
			tj_loppu_pvm: tj_loppupvm,
			tj_hakusana: tj_haku,
			tj_haettavaarvo: tj_arvo,
			jarjestys: sihteeri_jarjestys,
			jarjestettavaarvo: sihteeri_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "[]":
						$("#sihteeritauludata").html("");
						$("#sihteeritauludata").append(
							"<tr>" +
								"<td colspan='4'><span>Sihteereitä ei löytynyt</span></td>" +
								"</tr>"
						);
						break;

					case "parametri":
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#sihteeritauludata").html("");
						let sihteeritmaara = replyObj[0];
						if (sihteeritmaara == 1) {
							$("#sihteeri_maara").html(sihteeritmaara + " sihteeri");
						} else {
							$("#sihteeri_maara").html(sihteeritmaara + " sihteeriä");
						}

						for (let i = 1; i < replyObj.length; i++) {
							let tyojakso_tarkistus = "";

							let alittuvat_tyomaara_tiedot =
								replyObj[i].alittuvat_tyomaara_tiedot;
							for (let tyomaara in alittuvat_tyomaara_tiedot) {
								if ($("#sihteeri_varoitusvalinta").prop("checked")) {
									tyojakso_tarkistus +=
										"<img src='css/imgs/varoitus.png' class='varoitus_kuvake' alt='Tyomäärä alittuu'/>" +
										tyomaara +
										"%";
								} else {
									if (alittuvat_tyomaara_tiedot[tyomaara] > 1) {
										tyojakso_tarkistus +=
											"<img src='css/imgs/varoitus.png' class='varoitus_kuvake' alt='Tyomäärä alittuu'/>" +
											tyomaara +
											"% / " +
											alittuvat_tyomaara_tiedot[tyomaara] +
											" jaksoa";
									} else {
										tyojakso_tarkistus +=
											"<img src='css/imgs/varoitus.png' class='varoitus_kuvake' alt='Tyomäärä alittuu'/>" +
											tyomaara +
											"% / " +
											alittuvat_tyomaara_tiedot[tyomaara] +
											" jakso";
									}
								}
							}

							let tyojaksomaarateksti = "";
							let jaksomaarat = "";
							let alijaksomaarat = "";
							if (replyObj[i].ajanjakson_jaksot > 0) {
								jaksomaarat =
									"Työjaksot: " +
									replyObj[i].naytettavat_jaksot +
									" / " +
									replyObj[i].ajanjakson_jaksot;
							}

							if (replyObj[i].ajanjakson_alijaksot > 0) {
								alijaksomaarat =
									"Alijaksot: " +
									replyObj[i].naytettavat_alijaksot +
									" / " +
									replyObj[i].ajanjakson_alijaksot;
							}

							if (jaksomaarat == "" && alijaksomaarat == "") {
								tyojaksomaarateksti = "Ei työjaksoja";
							} else {
								if (jaksomaarat != "") {
									alijaksomaarat = " " + alijaksomaarat;
								}
								tyojaksomaarateksti = jaksomaarat + alijaksomaarat;
							}

							let id = replyObj[i].id;
							let sihteeritauludata =
								"<tr id='sihteeri_rivi_" +
								id +
								"'>" +
								"<td class='teksti_vasen'>" +
								"<img id='sihteeri_laajenna_" +
								id +
								"' src='css/imgs/laajenna.png' class='laajenna_kuvake' alt='Laajenna'/>" +
								"<span id='sihteeri_maara_" +
								id +
								"' class='sihteerimaara_teksti'>" +
								tyojaksomaarateksti +
								"</span>" +
								"<div id='sihteeri_tarkistus_" +
								id +
								"' class='sihteeri_tarkistuskehys'>" +
								tyojakso_tarkistus +
								"</div>" +
								"</td>" +
								"<td class='teksti_keskella'><span id='sihteeri_vakanssinumero_" +
								id +
								"'>" +
								replyObj[i].vakanssinumero +
								"</span></td>" +
								"<td class='teksti_keskella'><span id='sihteeri_nimi_" +
								id +
								"'>" +
								replyObj[i].nimi +
								"</span></td>" +
								"<td class='teksti_keskella'><span id='sihteeri_nimike_" +
								id +
								"'>" +
								replyObj[i].nimike +
								"</span></td>" +
								"</tr>" +
								"<tr>" +
								"<td colspan='4'>" +
								"<div id='sihteeri_rivi_lapsitaulu_kehys_" +
								id +
								"' class='piilotettu sihteeri_lapsitaulu_kehys'>" +
								"<table>" +
								"<thead>" +
								"<th id='sihteeri_rivi_lapsitaulu_osasto_" +
								id +
								"' class='teksti_keskella'>Osasto</th>" +
								"<th id='sihteeri_rivi_lapsitaulu_kustannusnumero_" +
								id +
								"' class='teksti_keskella'>Kustannus</th>" +
								"<th id='sihteeri_rivi_lapsitaulu_alkupvm_" +
								id +
								"' class='teksti_keskella'>Alku pvm</th>" +
								"<th id='sihteeri_rivi_lapsitaulu_loppupvm_" +
								id +
								"' class='teksti_keskella'>Loppu pvm</th>" +
								"<th id='sihteeri_rivi_lapsitaulu_tyomaara_" +
								id +
								"' class='lyhyt teksti_keskella'>Työmäärä</th>" +
								"<th id='sihteeri_rivi_lapsitaulu_tausta_" +
								id +
								"' class='teksti_keskella'>Tausta</th>" +
								"<th id='sihteeri_rivi_lapsitaulu_kommentti_" +
								id +
								"' class='teksti_keskella'>Kommentti</th>" +
								"<th id='sihteeri_rivi_lapsitaulu_alijakso_" +
								id +
								"' class='teksti_keskella'>Alijakso</th>" +
								"<th><span id='sihteeri_rivi_lapsitaulu_jarjestysarvo_" +
								id +
								"' class='piilotettu'>alku_pvm</span><span id='sihteeri_rivi_lapsitaulu_jarjestys_" +
								id +
								"' class='piilotettu'>ASC</span></th>" +
								"<th></th>" +
								"</thead>" +
								"<tbody id='sihteeri_rivi_lapsitaulu_" +
								id +
								"' class='sihteeri_rivi_lapsitaulu_tiedot'>" +
								"</tbody>" +
								"</table>" +
								"</div>" +
								"</td>" +
								"</tr>";

							$("#sihteeritauludata").append(sihteeritauludata);

							$("#sihteeri_rivi_lapsitaulu_osasto_" + id).click(function () {
								let id = $(this)
									.prop("id")
									.replace("sihteeri_rivi_lapsitaulu_osasto_", "");
								sihteeri_aseta_tyojakso_jarjestys(id, "osasto");
							});

							$("#sihteeri_rivi_lapsitaulu_kustannusnumero_" + id).click(
								function () {
									let id = $(this)
										.prop("id")
										.replace("sihteeri_rivi_lapsitaulu_kustannusnumero_", "");
									sihteeri_aseta_tyojakso_jarjestys(id, "kustannusnumero");
								}
							);

							$("#sihteeri_rivi_lapsitaulu_alkupvm_" + id).click(function () {
								let id = $(this)
									.prop("id")
									.replace("sihteeri_rivi_lapsitaulu_alkupvm_", "");
								sihteeri_aseta_tyojakso_jarjestys(id, "alku_pvm");
							});

							$("#sihteeri_rivi_lapsitaulu_loppupvm_" + id).click(function () {
								let id = $(this)
									.prop("id")
									.replace("sihteeri_rivi_lapsitaulu_loppupvm_", "");
								sihteeri_aseta_tyojakso_jarjestys(id, "loppu_pvm");
							});

							$("#sihteeri_rivi_lapsitaulu_tyomaara_" + id).click(function () {
								let id = $(this)
									.prop("id")
									.replace("sihteeri_rivi_lapsitaulu_tyomaara_", "");
								sihteeri_aseta_tyojakso_jarjestys(id, "prosentti");
							});

							$("#sihteeri_rivi_lapsitaulu_tausta_" + id).click(function () {
								let id = $(this)
									.prop("id")
									.replace("sihteeri_rivi_lapsitaulu_tausta_", "");
								sihteeri_aseta_tyojakso_jarjestys(id, "tausta");
							});

							$("#sihteeri_rivi_lapsitaulu_kommentti_" + id).click(function () {
								let id = $(this)
									.prop("id")
									.replace("sihteeri_rivi_lapsitaulu_kommentti_", "");
								sihteeri_aseta_tyojakso_jarjestys(id, "kommentti");
							});

							$("#sihteeri_rivi_lapsitaulu_alijakso_" + id).click(function () {
								let id = $(this)
									.prop("id")
									.replace("sihteeri_rivi_lapsitaulu_alijakso_", "");
								sihteeri_aseta_tyojakso_jarjestys(id, "alijakso");
							});

							$("#sihteeri_laajenna_" + id).click(function () {
								let id = $(this).prop("id").replace("sihteeri_laajenna_", "");

								if (
									$("#sihteeri_rivi_lapsitaulu_kehys_" + id).hasClass(
										"piilotettu"
									)
								) {
									$("#sihteeri_rivi_lapsitaulu_kehys_" + id).removeClass(
										"piilotettu"
									);
									$("#sihteeri_rivi_lapsitaulu_kehys_" + id).slideDown("slow");
									hae_sihteerin_tyojaksot(id);
									$("#sihteeri_rivi_" + id).addClass("valittu_sihteeri_rivi");
								} else {
									$("#sihteeri_rivi_lapsitaulu_kehys_" + id).slideUp(
										"slow",
										function () {
											$(".valittu_sihteeri_rivi").removeClass(
												"valittu_sihteeri_rivi"
											);
											$("#sihteeri_rivi_lapsitaulu_kehys_" + id).addClass(
												"piilotettu"
											);
										}
									);
								}
							});
						}
				}
			}
		}
	);
}

function sihteeri_aseta_tyojakso_jarjestys(id, jarjestysarvo) {
	if (
		$("#sihteeri_rivi_lapsitaulu_jarjestysarvo_" + id).html() == jarjestysarvo
	) {
		if ($("#sihteeri_rivi_lapsitaulu_jarjestys_" + id).html() == "DESC") {
			$("#sihteeri_rivi_lapsitaulu_jarjestys_" + id).html("ASC");
		} else {
			$("#sihteeri_rivi_lapsitaulu_jarjestys_" + id).html("DESC");
		}
	} else {
		$("#sihteeri_rivi_lapsitaulu_jarjestysarvo_" + id).html(jarjestysarvo);
		$("#sihteeri_rivi_lapsitaulu_jarjestys_" + id).html("ASC");
	}

	hae_sihteerin_tyojaksot(id);
}

function hae_sihteerin_tyojaksot(sih_sihteeri_id) {
	let sih_alku_pvm = $.datepicker.formatDate(
		"dd.mm.yy",
		$("#sihteeri_alku_pvm").datepicker("getDate")
	);
	let sih_loppu_pvm = $.datepicker.formatDate(
		"dd.mm.yy",
		$("#sihteeri_loppu_pvm").datepicker("getDate")
	);
	let sih_varoitustila = 1;
	if ($("#sihteeri_varoitusvalinta").prop("checked") == false) {
		sih_varoitustila = 0;
	}
	let sih_hakusana = $("#sihteeri_tyojaksohaku_hakusana").val();
	let sih_arvo = $("#sihteeri_tyojaksohaku_haettavaarvo").val();

	if ($("#latausnakyma").css("display") == "none") {
		$("#sihteerilatausRuutu").dialog("open");
	}

	let sih_jarjestys = $(
		"#sihteeri_rivi_lapsitaulu_jarjestys_" + sih_sihteeri_id
	).html();
	let sih_jarjestysarvo = $(
		"#sihteeri_rivi_lapsitaulu_jarjestysarvo_" + sih_sihteeri_id
	).html();

	$("#sihteeri_rivi_lapsitaulu_" + sih_sihteeri_id).html(
		"<tr id='sihteeri_rivi_lapsitaulu_lisaysrivi_" +
			sih_sihteeri_id +
			"' class='sihteeri_lisaysrivi'>" +
			"<td class='teksti_keskella'><select id='sihteeri_osasto_lisaysrivi_" +
			sih_sihteeri_id +
			"' title='Osasto' class='valintakentta sihteeri_valinta'></select></td>" +
			"<td class='teksti_keskella'><select id='sihteeri_kustannusnumero_lisaysrivi_" +
			sih_sihteeri_id +
			"' title='Kustannus' class='valintakentta sihteeri_valinta'></select></td>" +
			"<td class='teksti_keskella'><input id='sihteeri_alku_pvm_lisaysrivi_" +
			sih_sihteeri_id +
			"' class='pvm_kentta' readonly /></td>" +
			"<td class='teksti_keskella'><input id='sihteeri_loppu_pvm_lisaysrivi_" +
			sih_sihteeri_id +
			"' class='pvm_kentta' readonly /></td>" +
			"<td class='teksti_keskella'><select id='sihteeri_tyomaara_lisaysrivi_" +
			sih_sihteeri_id +
			"' title='Työmäärä %' class='valintakentta sihteeri_valinta'></select></td>" +
			"<td class='teksti_keskella'><select id='sihteeri_sihteeritausta_lisaysrivi_" +
			sih_sihteeri_id +
			"' title='Tausta' class='valintakentta sihteeri_valinta'></select></td>" +
			"<td class='teksti_keskella'><input id='sihteeri_kommentti_lisaysrivi_" +
			sih_sihteeri_id +
			"' class='sihteeri_kommenttikentta'/></td>" +
			"<td class='teksti_keskella'><input id='sihteeri_alijakso_lisaysrivi_" +
			sih_sihteeri_id +
			"' type='checkbox' class='sihteeri_alijaksokentta'/><span>Alijakso</span></td>" +
			"<td class='teksti_keskella'><button id='sihteeri_tallenna_lisaysrivi_" +
			sih_sihteeri_id +
			"' class='sihteeri_tallennapainike piilonakyvissa'>Tallenna</button></td>" +
			"<td class='teksti_keskella'></td>" +
			"</tr>"
	);

	$("#sihteeri_tallenna_lisaysrivi_" + sih_sihteeri_id).click(function () {
		sihteeri_tallenna_tyojakso(
			$(this).prop("id").replace("sihteeri_tallenna_lisaysrivi_", ""),
			0
		);
	});

	$("#sihteeri_osasto_lisaysrivi_" + sih_sihteeri_id).html("");
	$("#sihteeri_osasto_lisaysrivi_" + sih_sihteeri_id).append(
		sihteeri_osasto_valinnat
	);
	$("#sihteeri_osasto_lisaysrivi_" + sih_sihteeri_id).val(0);
	$("#sihteeri_osasto_lisaysrivi_" + sih_sihteeri_id).change(function () {
		if (
			!$(
				"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_osasto_lisaysrivi_", "")
			).hasClass("sihteeri_rivi_muutettu")
		) {
			$(
				"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_osasto_lisaysrivi_", "")
			).addClass("sihteeri_rivi_muutettu", 500);
		}
		if (
			$(
				"#sihteeri_tallenna_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_osasto_lisaysrivi_", "")
			).hasClass("piilonakyvissa")
		) {
			$(
				"#sihteeri_tallenna_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_osasto_lisaysrivi_", "")
			).removeClass("piilonakyvissa", 500);
		}
	});

	$("#sihteeri_kustannusnumero_lisaysrivi_" + sih_sihteeri_id).html("");
	$("#sihteeri_kustannusnumero_lisaysrivi_" + sih_sihteeri_id).append(
		sihteeri_kustannusnumero_valinnat
	);
	$("#sihteeri_kustannusnumero_lisaysrivi_" + sih_sihteeri_id).val(0);
	$("#sihteeri_kustannusnumero_lisaysrivi_" + sih_sihteeri_id).change(
		function () {
			if (
				!$(
					"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
						$(this)
							.prop("id")
							.replace("sihteeri_kustannusnumero_lisaysrivi_", "")
				).hasClass("sihteeri_rivi_muutettu")
			) {
				$(
					"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
						$(this)
							.prop("id")
							.replace("sihteeri_kustannusnumero_lisaysrivi_", "")
				).addClass("sihteeri_rivi_muutettu", 500);
			}
			if (
				$(
					"#sihteeri_tallenna_lisaysrivi_" +
						$(this)
							.prop("id")
							.replace("sihteeri_kustannusnumero_lisaysrivi_", "")
				).hasClass("piilonakyvissa")
			) {
				$(
					"#sihteeri_tallenna_lisaysrivi_" +
						$(this)
							.prop("id")
							.replace("sihteeri_kustannusnumero_lisaysrivi_", "")
				).removeClass("piilonakyvissa", 500);
			}
		}
	);

	$("#sihteeri_alku_pvm_lisaysrivi_" + sih_sihteeri_id).datepicker({
		dateFormat: "dd.mm.yy",
		regional: "fi",
		showOtherMonths: true,
		numberOfMonths: 1,
		showWeek: true,
		onSelect: function (dateText, inst) {
			$(
				"#sihteeri_loppu_pvm_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_alku_pvm_lisaysrivi_", "")
			).datepicker("option", "minDate", dateText);
			if (
				!$(
					"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
						$(this).prop("id").replace("sihteeri_alku_pvm_lisaysrivi_", "")
				).hasClass("sihteeri_rivi_muutettu")
			) {
				$(
					"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
						$(this).prop("id").replace("sihteeri_alku_pvm_lisaysrivi_", "")
				).addClass("sihteeri_rivi_muutettu", 500);
			}
			if (
				$(
					"#sihteeri_tallenna_lisaysrivi_" +
						$(this).prop("id").replace("sihteeri_alku_pvm_lisaysrivi_", "")
				).hasClass("piilonakyvissa")
			) {
				$(
					"#sihteeri_tallenna_lisaysrivi_" +
						$(this).prop("id").replace("sihteeri_alku_pvm_lisaysrivi_", "")
				).removeClass("piilonakyvissa", 500);
			}
		},
	});

	$("#sihteeri_loppu_pvm_lisaysrivi_" + sih_sihteeri_id).datepicker({
		dateFormat: "dd.mm.yy",
		regional: "fi",
		showOtherMonths: true,
		numberOfMonths: 1,
		showWeek: true,
		onSelect: function (dateText, inst) {
			$(
				"#sihteeri_alku_pvm_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_loppu_pvm_lisaysrivi_", "")
			).datepicker("option", "maxDate", dateText);
			if (
				!$(
					"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
						$(this).prop("id").replace("sihteeri_loppu_pvm_lisaysrivi_", "")
				).hasClass("sihteeri_rivi_muutettu")
			) {
				$(
					"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
						$(this).prop("id").replace("sihteeri_loppu_pvm_lisaysrivi_", "")
				).addClass("sihteeri_rivi_muutettu", 500);
			}
			if (
				$(
					"#sihteeri_tallenna_lisaysrivi_" +
						$(this).prop("id").replace("sihteeri_loppu_pvm_lisaysrivi_", "")
				).hasClass("piilonakyvissa")
			) {
				$(
					"#sihteeri_tallenna_lisaysrivi_" +
						$(this).prop("id").replace("sihteeri_loppu_pvm_lisaysrivi_", "")
				).removeClass("piilonakyvissa", 500);
			}
		},
	});

	$("#sihteeri_tyomaara_lisaysrivi_" + sih_sihteeri_id).html("");
	$("#sihteeri_tyomaara_lisaysrivi_" + sih_sihteeri_id).append(
		sihteeri_tyomaara_valinnat
	);
	$("#sihteeri_tyomaara_lisaysrivi_" + sih_sihteeri_id).val(0);
	$("#sihteeri_tyomaara_lisaysrivi_" + sih_sihteeri_id).change(function () {
		if (
			!$(
				"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_tyomaara_lisaysrivi_", "")
			).hasClass("sihteeri_rivi_muutettu")
		) {
			$(
				"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_tyomaara_lisaysrivi_", "")
			).addClass("sihteeri_rivi_muutettu", 500);
		}
		if (
			$(
				"#sihteeri_tallenna_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_tyomaara_lisaysrivi_", "")
			).hasClass("piilonakyvissa")
		) {
			$(
				"#sihteeri_tallenna_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_tyomaara_lisaysrivi_", "")
			).removeClass("piilonakyvissa", 500);
		}
	});

	$("#sihteeri_sihteeritausta_lisaysrivi_" + sih_sihteeri_id).html("");
	$("#sihteeri_sihteeritausta_lisaysrivi_" + sih_sihteeri_id).append(
		sihteeri_tausta_valinnat
	);
	$("#sihteeri_sihteeritausta_lisaysrivi_" + sih_sihteeri_id).val(-1);
	$("#sihteeri_sihteeritausta_lisaysrivi_" + sih_sihteeri_id).change(
		function () {
			if (
				!$(
					"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
						$(this)
							.prop("id")
							.replace("sihteeri_sihteeritausta_lisaysrivi_", "")
				).hasClass("sihteeri_rivi_muutettu")
			) {
				$(
					"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
						$(this)
							.prop("id")
							.replace("sihteeri_sihteeritausta_lisaysrivi_", "")
				).addClass("sihteeri_rivi_muutettu", 500);
			}
			if (
				$(
					"#sihteeri_tallenna_lisaysrivi_" +
						$(this)
							.prop("id")
							.replace("sihteeri_sihteeritausta_lisaysrivi_", "")
				).hasClass("piilonakyvissa")
			) {
				$(
					"#sihteeri_tallenna_lisaysrivi_" +
						$(this)
							.prop("id")
							.replace("sihteeri_sihteeritausta_lisaysrivi_", "")
				).removeClass("piilonakyvissa", 500);
			}
		}
	);

	$("#sihteeri_kommentti_lisaysrivi_" + sih_sihteeri_id).change(function () {
		if (
			!$(
				"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_kommentti_lisaysrivi_", "")
			).hasClass("sihteeri_rivi_muutettu")
		) {
			$(
				"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_kommentti_lisaysrivi_", "")
			).addClass("sihteeri_rivi_muutettu", 500);
		}
		if (
			$(
				"#sihteeri_tallenna_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_kommentti_lisaysrivi_", "")
			).hasClass("piilonakyvissa")
		) {
			$(
				"#sihteeri_tallenna_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_kommentti_lisaysrivi_", "")
			).removeClass("piilonakyvissa", 500);
		}
	});

	$("#sihteeri_alijakso_lisaysrivi_" + sih_sihteeri_id).click(function () {
		if (
			!$(
				"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_alijakso_lisaysrivi_", "")
			).hasClass("sihteeri_rivi_muutettu")
		) {
			$(
				"#sihteeri_rivi_lapsitaulu_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_alijakso_lisaysrivi_", "")
			).addClass("sihteeri_rivi_muutettu", 500);
		}
		if (
			$(
				"#sihteeri_tallenna_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_alijakso_lisaysrivi_", "")
			).hasClass("piilonakyvissa")
		) {
			$(
				"#sihteeri_tallenna_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_alijakso_lisaysrivi_", "")
			).removeClass("piilonakyvissa", 500);
		}

		if ($(this).prop("checked") == true) {
			$(
				"#sihteeri_sihteeritausta_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_alijakso_lisaysrivi_", "")
			).html(sihteeri_alijakso_tausta_valinnat);
			$(
				"#sihteeri_tyomaara_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_alijakso_lisaysrivi_", "")
			).html(sihteeri_alijakso_tyomaara_valinnat);
		} else {
			$(
				"#sihteeri_sihteeritausta_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_alijakso_lisaysrivi_", "")
			).html(sihteeri_tausta_valinnat);
			$(
				"#sihteeri_tyomaara_lisaysrivi_" +
					$(this).prop("id").replace("sihteeri_alijakso_lisaysrivi_", "")
			).html(sihteeri_tyomaara_valinnat);
		}

		$(
			"#sihteeri_sihteeritausta_lisaysrivi_" +
				$(this).prop("id").replace("sihteeri_alijakso_lisaysrivi_", "")
		).val(0);
		$(
			"#sihteeri_tyomaara_lisaysrivi_" +
				$(this).prop("id").replace("sihteeri_alijakso_lisaysrivi_", "")
		).val(0);
	});

	$.post(
		"php/hae_sihteerin_tyojaksot.php",
		{
			sihteeri_id: sih_sihteeri_id,
			alku_pvm: sih_alku_pvm,
			loppu_pvm: sih_loppu_pvm,
			varoitus: sih_varoitustila,
			hakusana: sih_hakusana,
			haettavaarvo: sih_arvo,
			jarjestys: sih_jarjestys,
			jarjestettavaarvo: sih_jarjestysarvo,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				$("#sihteerilatausRuutu").dialog("close");
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						$("#sihteerilatausRuutu").dialog("close");
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#sihteerilatausRuutu").dialog("close");

						let tyojakso_tarkistus = "";
						let alittuvat_tyomaara_tiedot =
							replyObj[0].alittuvat_tyomaara_tiedot;
						for (let tyomaara in alittuvat_tyomaara_tiedot) {
							if ($("#sihteeri_varoitusvalinta").prop("checked")) {
								tyojakso_tarkistus +=
									"<img src='css/imgs/varoitus.png' class='varoitus_kuvake' alt='Tyomäärä alittuu'/>" +
									tyomaara +
									"%";
							} else {
								if (alittuvat_tyomaara_tiedot[tyomaara] > 1) {
									tyojakso_tarkistus +=
										"<img src='css/imgs/varoitus.png' class='varoitus_kuvake' alt='Tyomäärä alittuu'/>" +
										tyomaara +
										"% / " +
										alittuvat_tyomaara_tiedot[tyomaara] +
										" jaksoa";
								} else {
									tyojakso_tarkistus +=
										"<img src='css/imgs/varoitus.png' class='varoitus_kuvake' alt='Tyomäärä alittuu'/>" +
										tyomaara +
										"% / " +
										alittuvat_tyomaara_tiedot[tyomaara] +
										" jakso";
								}
							}
						}

						$("#sihteeri_tarkistus_" + sih_sihteeri_id).html(
							tyojakso_tarkistus
						);

						let tyojaksomaarateksti = "";
						let jaksomaarat = "";
						let alijaksomaarat = "";
						if (replyObj[0].ajanjakson_jaksot > 0) {
							jaksomaarat =
								"Työjaksot: " +
								replyObj[0].naytettavat_jaksot +
								" / " +
								replyObj[0].ajanjakson_jaksot;
						}

						if (replyObj[0].ajanjakson_alijaksot > 0) {
							alijaksomaarat =
								"Alijaksot: " +
								replyObj[0].naytettavat_alijaksot +
								" / " +
								replyObj[0].ajanjakson_alijaksot;
						}

						if (jaksomaarat == "" && alijaksomaarat == "") {
							tyojaksomaarateksti = "Ei työjaksoja";
						} else {
							if (jaksomaarat != "") {
								alijaksomaarat = " " + alijaksomaarat;
							}
							tyojaksomaarateksti = jaksomaarat + alijaksomaarat;
						}

						$("#sihteeri_maara_" + sih_sihteeri_id).html(tyojaksomaarateksti);

						for (let i = 1; i < replyObj.length; i++) {
							let sihteeripoisto = "";
							let id = replyObj[i].id;
							if (sihteerihallinta) {
								sihteeripoisto =
									"<img id='sihteeri_poisto_" +
									id +
									"' src='css/imgs/poista.png' class='poisto_kuvake' alt='Poista'/>";
							}

							let alijakso_valittu = "";
							if (replyObj[i].alijakso == 1) {
								alijakso_valittu = " checked";
							}

							let sihteeritauludata =
								"<tr id='sihteeri_rivi_lapsitaulu_rivi_" +
								id +
								"'>" +
								"<td class='teksti_keskella'><select id='sihteeri_osasto_" +
								id +
								"' title='Osasto' class='valintakentta sihteeri_valinta'></select></td>" +
								"<td class='teksti_keskella'><select id='sihteeri_kustannusnumero_" +
								id +
								"' title='Kustannus' class='valintakentta sihteeri_valinta'></select></td>" +
								"<td class='teksti_keskella'><input id='sihteeri_alku_pvm_" +
								id +
								"' class='pvm_kentta' readonly /></td>" +
								"<td class='teksti_keskella'><input id='sihteeri_loppu_pvm_" +
								id +
								"' class='pvm_kentta' readonly /></td>" +
								"<td class='teksti_keskella'><select id='sihteeri_tyomaara_" +
								id +
								"' title='Työmäärä %' class='valintakentta sihteeri_valinta'></select></td>" +
								"<td class='teksti_keskella'><select id='sihteeri_sihteeritausta_" +
								id +
								"' title='sihteeritausta' class='valintakentta sihteeri_valinta'></select></td>" +
								"<td class='teksti_keskella'><input id='sihteeri_kommentti_" +
								id +
								"' class='sihteeri_kommenttikentta' value='" +
								replyObj[i].kommentti +
								"' /></td>" +
								"<td class='teksti_keskella'><input id='sihteeri_alijakso_" +
								id +
								"' type='checkbox' class='sihteeri_alijaksokentta'" +
								alijakso_valittu +
								"/><span>Alijakso</span></td>" +
								"<td class='teksti_keskella'><button id='sihteeri_tallenna_" +
								id +
								"' class='sihteeri_tallennapainike piilonakyvissa'>Päivitä</button></td>" +
								"<td class='teksti_keskella'>" +
								sihteeripoisto +
								"</td>" +
								"</tr>";

							$("#sihteeri_rivi_lapsitaulu_" + sih_sihteeri_id).append(
								sihteeritauludata
							);

							if (sihteerihallinta) {
								$("#sihteeri_poisto_" + id).click(function () {
									let sihteerit_id = $(this)
										.closest(".sihteeri_rivi_lapsitaulu_tiedot")
										.prop("id")
										.replace("sihteeri_rivi_lapsitaulu_", "");
									sihteeri_nayta_tyojaksonpoisto(
										sihteerit_id,
										$(this).prop("id").replace("sihteeri_poisto_", "")
									);
								});
							}

							$("#sihteeri_tallenna_" + id).click(function () {
								let sihteerit_id = $(this)
									.closest(".sihteeri_rivi_lapsitaulu_tiedot")
									.prop("id")
									.replace("sihteeri_rivi_lapsitaulu_", "");
								sihteeri_tallenna_tyojakso(
									sihteerit_id,
									$(this).prop("id").replace("sihteeri_tallenna_", "")
								);
							});

							$("#sihteeri_osasto_" + id).html("");
							$("#sihteeri_osasto_" + id).append(sihteeri_osasto_valinnat);
							$("#sihteeri_osasto_" + id).val(replyObj[i].osasto_id);
							$("#sihteeri_osasto_" + id).change(function () {
								if (
									!$(
										"#sihteeri_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("sihteeri_osasto_", "")
									).hasClass("sihteeri_rivi_muutettu")
								) {
									$(
										"#sihteeri_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("sihteeri_osasto_", "")
									).addClass("sihteeri_rivi_muutettu", 500);
								}
								if (
									$(
										"#sihteeri_tallenna_" +
											$(this).prop("id").replace("sihteeri_osasto_", "")
									).hasClass("piilonakyvissa")
								) {
									$(
										"#sihteeri_tallenna_" +
											$(this).prop("id").replace("sihteeri_osasto_", "")
									).removeClass("piilonakyvissa", 500);
								}
							});

							$("#sihteeri_kustannusnumero_" + id).html("");
							$("#sihteeri_kustannusnumero_" + id).append(
								sihteeri_kustannusnumero_valinnat
							);
							$("#sihteeri_kustannusnumero_" + id).val(
								replyObj[i].kustannusnumero
							);
							$("#sihteeri_kustannusnumero_" + id).change(function () {
								if (
									!$(
										"#sihteeri_rivi_lapsitaulu_rivi_" +
											$(this)
												.prop("id")
												.replace("sihteeri_kustannusnumero_", "")
									).hasClass("sihteeri_rivi_muutettu")
								) {
									$(
										"#sihteeri_rivi_lapsitaulu_rivi_" +
											$(this)
												.prop("id")
												.replace("sihteeri_kustannusnumero_", "")
									).addClass("sihteeri_rivi_muutettu", 500);
								}
								if (
									$(
										"#sihteeri_tallenna_" +
											$(this)
												.prop("id")
												.replace("sihteeri_kustannusnumero_", "")
									).hasClass("piilonakyvissa")
								) {
									$(
										"#sihteeri_tallenna_" +
											$(this)
												.prop("id")
												.replace("sihteeri_kustannusnumero_", "")
									).removeClass("piilonakyvissa", 500);
								}
							});

							$("#sihteeri_alku_pvm_" + id).datepicker({
								dateFormat: "dd.mm.yy",
								regional: "fi",
								showOtherMonths: true,
								numberOfMonths: 1,
								showWeek: true,
								onSelect: function (dateText, inst) {
									$(
										"#sihteeri_loppu_pvm_" +
											$(this).prop("id").replace("sihteeri_alku_pvm_", "")
									).datepicker("option", "minDate", dateText);
									if (
										!$(
											"#sihteeri_rivi_lapsitaulu_rivi_" +
												$(this).prop("id").replace("sihteeri_alku_pvm_", "")
										).hasClass("sihteeri_rivi_muutettu")
									) {
										$(
											"#sihteeri_rivi_lapsitaulu_rivi_" +
												$(this).prop("id").replace("sihteeri_alku_pvm_", "")
										).addClass("sihteeri_rivi_muutettu", 500);
									}
									if (
										$(
											"#sihteeri_tallenna_" +
												$(this).prop("id").replace("sihteeri_alku_pvm_", "")
										).hasClass("piilonakyvissa")
									) {
										$(
											"#sihteeri_tallenna_" +
												$(this).prop("id").replace("sihteeri_alku_pvm_", "")
										).removeClass("piilonakyvissa", 500);
									}
								},
							});

							$("#sihteeri_loppu_pvm_" + id).datepicker({
								dateFormat: "dd.mm.yy",
								regional: "fi",
								showOtherMonths: true,
								numberOfMonths: 1,
								showWeek: true,
								onSelect: function (dateText, inst) {
									$(
										"#sihteeri_alku_pvm_" +
											$(this).prop("id").replace("sihteeri_loppu_pvm_", "")
									).datepicker("option", "maxDate", dateText);
									if (
										!$(
											"#sihteeri_rivi_lapsitaulu_rivi_" +
												$(this).prop("id").replace("sihteeri_loppu_pvm_", "")
										).hasClass("sihteeri_rivi_muutettu")
									) {
										$(
											"#sihteeri_rivi_lapsitaulu_rivi_" +
												$(this).prop("id").replace("sihteeri_loppu_pvm_", "")
										).addClass("sihteeri_rivi_muutettu", 500);
									}
									if (
										$(
											"#sihteeri_tallenna_" +
												$(this).prop("id").replace("sihteeri_loppu_pvm_", "")
										).hasClass("piilonakyvissa")
									) {
										$(
											"#sihteeri_tallenna_" +
												$(this).prop("id").replace("sihteeri_loppu_pvm_", "")
										).removeClass("piilonakyvissa", 500);
									}
								},
							});

							$("#sihteeri_alku_pvm_" + id).val(replyObj[i].alku_pvm);
							$("#sihteeri_loppu_pvm_" + id).datepicker(
								"option",
								"minDate",
								replyObj[i].alku_pvm
							);
							$("#sihteeri_loppu_pvm_" + id).val(replyObj[i].loppu_pvm);
							$("#sihteeri_alku_pvm_" + id).datepicker(
								"option",
								"maxDate",
								replyObj[i].loppu_pvm
							);

							$("#sihteeri_tyomaara_" + id).html("");
							if (replyObj[i].alijakso == 1) {
								$("#sihteeri_tyomaara_" + id).append(
									sihteeri_alijakso_tyomaara_valinnat
								);
							} else {
								$("#sihteeri_tyomaara_" + id).append(
									sihteeri_tyomaara_valinnat
								);
							}
							$("#sihteeri_tyomaara_" + id).val(replyObj[i].tyomaara_id);
							$("#sihteeri_tyomaara_" + id).change(function () {
								if (
									!$(
										"#sihteeri_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("sihteeri_tyomaara_", "")
									).hasClass("sihteeri_rivi_muutettu")
								) {
									$(
										"#sihteeri_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("sihteeri_tyomaara_", "")
									).addClass("sihteeri_rivi_muutettu", 500);
								}
								if (
									$(
										"#sihteeri_tallenna_" +
											$(this).prop("id").replace("sihteeri_tyomaara_", "")
									).hasClass("piilonakyvissa")
								) {
									$(
										"#sihteeri_tallenna_" +
											$(this).prop("id").replace("sihteeri_tyomaara_", "")
									).removeClass("piilonakyvissa", 500);
								}
							});

							$("#sihteeri_sihteeritausta_" + id).html("");
							if (replyObj[i].alijakso == 1) {
								$("#sihteeri_sihteeritausta_" + id).append(
									sihteeri_alijakso_tausta_valinnat
								);
							} else {
								$("#sihteeri_sihteeritausta_" + id).append(
									sihteeri_tausta_valinnat
								);
							}
							$("#sihteeri_sihteeritausta_" + id).val(replyObj[i].tausta_id);
							$("#sihteeri_sihteeritausta_" + id).change(function () {
								if (
									!$(
										"#sihteeri_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("sihteeri_sihteeritausta_", "")
									).hasClass("sihteeri_rivi_muutettu")
								) {
									$(
										"#sihteeri_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("sihteeri_sihteeritausta_", "")
									).addClass("sihteeri_rivi_muutettu", 500);
								}
								if (
									$(
										"#sihteeri_tallenna_" +
											$(this).prop("id").replace("sihteeri_sihteeritausta_", "")
									).hasClass("piilonakyvissa")
								) {
									$(
										"#sihteeri_tallenna_" +
											$(this).prop("id").replace("sihteeri_sihteeritausta_", "")
									).removeClass("piilonakyvissa", 500);
								}
							});

							$("#sihteeri_kommentti_" + id).change(function () {
								if (
									!$(
										"#sihteeri_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("sihteeri_kommentti_", "")
									).hasClass("sihteeri_rivi_muutettu")
								) {
									$(
										"#sihteeri_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("sihteeri_kommentti_", "")
									).addClass("sihteeri_rivi_muutettu", 500);
								}
								if (
									$(
										"#sihteeri_tallenna_" +
											$(this).prop("id").replace("sihteeri_kommentti_", "")
									).hasClass("piilonakyvissa")
								) {
									$(
										"#sihteeri_tallenna_" +
											$(this).prop("id").replace("sihteeri_kommentti_", "")
									).removeClass("piilonakyvissa", 500);
								}
							});

							$("#sihteeri_alijakso_" + id).click(function () {
								if (
									!$(
										"#sihteeri_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("sihteeri_alijakso_", "")
									).hasClass("sihteeri_rivi_muutettu")
								) {
									$(
										"#sihteeri_rivi_lapsitaulu_rivi_" +
											$(this).prop("id").replace("sihteeri_alijakso_", "")
									).addClass("sihteeri_rivi_muutettu", 500);
								}
								if (
									$(
										"#sihteeri_tallenna_" +
											$(this).prop("id").replace("sihteeri_alijakso_", "")
									).hasClass("piilonakyvissa")
								) {
									$(
										"#sihteeri_tallenna_" +
											$(this).prop("id").replace("sihteeri_alijakso_", "")
									).removeClass("piilonakyvissa", 500);
								}

								if ($(this).prop("checked") == true) {
									$(
										"#sihteeri_sihteeritausta_" +
											$(this).prop("id").replace("sihteeri_alijakso_", "")
									).html(sihteeri_alijakso_tausta_valinnat);
									$(
										"#sihteeri_tyomaara_" +
											$(this).prop("id").replace("sihteeri_alijakso_", "")
									).html(sihteeri_alijakso_tyomaara_valinnat);
								} else {
									$(
										"#sihteeri_sihteeritausta_" +
											$(this).prop("id").replace("sihteeri_alijakso_", "")
									).html(sihteeri_tausta_valinnat);
									$(
										"#sihteeri_tyomaara_" +
											$(this).prop("id").replace("sihteeri_alijakso_", "")
									).html(sihteeri_tyomaara_valinnat);
								}

								$(
									"#sihteeri_sihteeritausta_" +
										$(this).prop("id").replace("sihteeri_alijakso_", "")
								).val(0);
								$(
									"#sihteeri_tyomaara_" +
										$(this).prop("id").replace("sihteeri_alijakso_", "")
								).val(0);
							});
						}

						$(
							"#sihteeri_rivi_lapsitaulu_kehys_" + sih_sihteeri_id + " button"
						).button();
						$("#sihteerilatausRuutu").dialog("close");
				}
			}
		}
	);
}

function sihteeri_tallenna_tyojakso(tj_sihteeri_id, tj_tyojakso_id) {
	let tj_osasto_id = "";
	let tj_kustannusnumero = "";
	let tj_alku_pvm = "";
	let tj_loppu_pvm = "";
	let tj_tyomaara_id = "";
	let tj_tausta_id = "";
	let tj_kommentti = "";
	let tj_alijakso = 0;

	let tyojakso_alku_pvm = "";
	let tyojakso_loppu_pvm = "";

	if (tj_tyojakso_id == 0) {
		tj_osasto_id = $("#sihteeri_osasto_lisaysrivi_" + tj_sihteeri_id).val();
		tj_kustannusnumero = $(
			"#sihteeri_kustannusnumero_lisaysrivi_" + tj_sihteeri_id
		).val();
		tj_alku_pvm = $("#sihteeri_alku_pvm_lisaysrivi_" + tj_sihteeri_id).val();
		tyojakso_alku_pvm = $(
			"#sihteeri_alku_pvm_lisaysrivi_" + tj_sihteeri_id
		).datepicker("getDate");
		tj_loppu_pvm = $("#sihteeri_loppu_pvm_lisaysrivi_" + tj_sihteeri_id).val();
		tyojakso_loppu_pvm = $(
			"#sihteeri_loppu_pvm_lisaysrivi_" + tj_sihteeri_id
		).datepicker("getDate");
		tj_tyomaara_id = $("#sihteeri_tyomaara_lisaysrivi_" + tj_sihteeri_id).val();
		tj_sihteeritausta_id = $(
			"#sihteeri_sihteeritausta_lisaysrivi_" + tj_sihteeri_id
		).val();
		tj_kommentti = $("#sihteeri_kommentti_lisaysrivi_" + tj_sihteeri_id).val();
		if (
			$("#sihteeri_alijakso_lisaysrivi_" + tj_sihteeri_id).prop("checked") ==
			true
		) {
			tj_alijakso = 1;
		}
	} else {
		tj_osasto_id = $("#sihteeri_osasto_" + tj_tyojakso_id).val();
		tj_kustannusnumero = $("#sihteeri_kustannusnumero_" + tj_tyojakso_id).val();
		tj_alku_pvm = $("#sihteeri_alku_pvm_" + tj_tyojakso_id).val();
		tyojakso_alku_pvm = $("#sihteeri_alku_pvm_" + tj_tyojakso_id).datepicker(
			"getDate"
		);
		tj_loppu_pvm = $("#sihteeri_loppu_pvm_" + tj_tyojakso_id).val();
		tyojakso_loppu_pvm = $("#sihteeri_loppu_pvm_" + tj_tyojakso_id).datepicker(
			"getDate"
		);
		tj_tyomaara_id = $("#sihteeri_tyomaara_" + tj_tyojakso_id).val();
		tj_sihteeritausta_id = $(
			"#sihteeri_sihteeritausta_" + tj_tyojakso_id
		).val();
		tj_kommentti = $("#sihteeri_kommentti_" + tj_tyojakso_id).val();
		if ($("#sihteeri_alijakso_" + tj_tyojakso_id).prop("checked") == true) {
			tj_alijakso = 1;
		}
	}

	if (
		tj_osasto_id == 0 ||
		tj_kustannusnumero == 0 ||
		tj_alku_pvm == "" ||
		tj_loppu_pvm == "" ||
		tj_tyomaara_id == 0 ||
		tj_sihteeritausta_id == 0
	) {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_sihteerityojakso.php",
		{
			sihteeri_id: tj_sihteeri_id,
			sihteerityojakso_id: tj_tyojakso_id,
			osasto_id: tj_osasto_id,
			kustannusnumero: tj_kustannusnumero,
			alku_pvm: tj_alku_pvm,
			loppu_pvm: tj_loppu_pvm,
			tyomaara_id: tj_tyomaara_id,
			tausta_id: tj_sihteeritausta_id,
			kommentti: tj_kommentti,
			alijakso: tj_alijakso,
		},
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				if (replyObj[0].virhe == "yli") {
					let viesti =
						"Työjaksojen työmäärä ylittää 100% (" + replyObj[0].viesti + ")";
					alert(viesti);
					if (tj_tyojakso_id == 1) {
						hae_sihteerin_tyojaksot(tj_sihteeri_id);
					}
				} else if (replyObj[0].virhe == "alijakso") {
					let viesti = replyObj[0].viesti;
					alert(viesti);
					if (tj_tyojakso_id == 1) {
						hae_sihteerin_tyojaksot(tj_sihteeri_id);
					}
				} else if (replyObj[0].virhe == "ylikirjoitus") {
					let viesti = replyObj[0].viesti;
					alert(viesti);
					if (tj_tyojakso_id == 1) {
						hae_sihteerin_tyojaksot(tj_sihteeri_id);
					}
				} else {
					nayta_tilaviesti("Työjakson tallennus onnistui");
					$("#sihteeri_tyojaksohaku_hakusana").val("");
					$("#sihteeri_sihteerithaku_hakusana").val("");

					if (
						$("#sihteeri_alku_pvm").val() != "" ||
						$("#sihteeri_loppu_pvm") != ""
					) {
						if ($("#sihteeri_alku_pvm").val() != "") {
							let nakyma_alku_pvm =
								$("#sihteeri_alku_pvm").datepicker("getDate");
							if (tyojakso_loppu_pvm < nakyma_alku_pvm) {
								$("#sihteeri_alku_pvm").val(tj_loppu_pvm);
							}
						}
						if ($("#sihteeri_loppu_pvm").val() != "") {
							let nakyma_loppu_pvm = $("#sihteeri_loppu_pvm").datepicker(
								"getDate"
							);
							if (tyojakso_alku_pvm > nakyma_loppu_pvm) {
								$("#sihteeri_loppu_pvm").val(tj_alku_pvm);
							}
						}
					}

					hae_sihteerin_tyojaksot(tj_sihteeri_id);
				}
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function sihteeri_nayta_tyojaksonpoisto(sihteeri_id, tj_id) {
	$("#sihteeri_poisto_teksti").html(
		"Poistetaanko sihteerin työjakso " +
			$("#sihteeri_alku_pvm_" + tj_id).val() +
			" - " +
			$("#sihteeri_loppu_pvm_" + tj_id).val() +
			" ?"
	);

	$("#sihteeri_poisto_sihteeri_id").html(sihteeri_id);
	$("#sihteeri_poisto_id").html(tj_id);
	$("#sihteeripoistoRuutu").dialog("open");
}

function sihteeri_poista_tyojakso() {
	let tj_id = $("#sihteeri_poisto_id").html();
	let sihteeri_id = $("#sihteeri_poisto_sihteeri_id").html();

	$.post("php/poista_sihteerityojakso.php", { id: tj_id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			$("#sihteeri_poisto_id").html("");
			$("#sihteeri_poisto_sihteeri_id").html("");
			$("#sihteeripoistoRuutu").dialog("close");
			hae_sihteerin_tyojaksot(sihteeri_id);
		} else {
			alert("Tietokantavirhe");
		}
	});
}
/*************************************** MATKANÄKYMÄ ******************************************/

function matka_nayta_pin_ruutu() {
	$("#matkapin").val("");
	$("#matkapinRuutu").dialog("open");
}

function matka_tarkista_pin() {
	let pin = $("#matkapin").val();

	$.post("php/tarkista_pin.php", { pin }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			let replyObj = JSON.parse(reply);
			if (replyObj[0] !== null) {
				$("#matkapinRuutu").dialog("close");
				$("#matka_sijainen").html(replyObj[0].nimi);
				$("#matka_sijainenid").html(replyObj[0].id);

				aktivoi_matkanakyma();
			} else {
				alert("Tarkista pin");
			}
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function alusta_matkanakyma() {
	if (!matkanakyma_alustettu) {
		$("#matkavuoropvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: false,
			numberOfMonths: 1,
			showWeek: true,
			showOn: "button",
			buttonImageOnly: true,
			buttonText: "Valitse päivämäärä",
			buttonImage: "css/imgs/vuorokalenteri.png",
			onChangeMonthYear: function (vuosi, kuukausi) {
				matka_hae_vuorovalinnat(vuosi, kuukausi);
			},
			onSelect: function (date) {
				const pvm = `${date.substr(6, 4)}-${date.substr(3, 2)}-${date.substr(
					0,
					2
				)}`;
				matka_aseta_vuorovalinnat(pvm);
			},
			beforeShowDay: function (date) {
				const pvm = $.datepicker.formatDate("yy-mm-dd", date);
				if (matka_sijaisen_vuorot != null) {
					if (Object.keys(matka_sijaisen_vuorot).includes(pvm)) {
						const vuoromaara = matka_sijaisen_vuorot[pvm].length;
						return [
							true,
							"matka_kalenteri_valittava_pvm",
							"Vuoroja " + vuoromaara + " kpl",
						];
					} else {
						return [false, "", ""];
					}
				} else {
					return [false, "", ""];
				}
			},
		});

		//Aseta pvm_kentta tyhjennys del (46) tai backspace (8) näppäimestä
		$("#matkavuoropvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#matkavuoropvm"));
			}
		});

		$("#matkalahetys_alku_pvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (dateText, inst) {
				$("#matkalahetys_loppu_pvm").datepicker("option", "minDate", dateText);
			},
		});

		//Aseta pvm_kentta tyhjennys del (46) tai backspace (8) näppäimestä
		$("#matkalahetys_alku_pvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#matkalahetys_alku_pvm"));
			}
		});

		$("#matkalahetys_loppu_pvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (dateText, inst) {
				$("#matkalahetys_alku_pvm").datepicker("option", "maxDate", dateText);
			},
		});

		//Aseta pvm_kentta tyhjennys del (46) tai backspace (8) näppäimestä
		$("#matkalahetys_loppu_pvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#matkalahetys_loppu_pvm"));
			}
		});

		$("#matkaraportti_alku_pvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (dateText, inst) {
				$("#matkaraportti_loppu_pvm").datepicker("option", "minDate", dateText);
				matka_hae_hyvaksytyt_matka_maarat();
			},
		});

		//Aseta pvm_kentta tyhjennys del (46) tai backspace (8) näppäimestä
		$("#matkaraportti_alku_pvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#matkaraportti_alku_pvm"));
			}
		});

		$("#matkaraportti_loppu_pvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (dateText, inst) {
				$("#matkaraportti_alku_pvm").datepicker("option", "maxDate", dateText);
				matka_hae_hyvaksytyt_matka_maarat();
			},
		});

		//Aseta pvm_kentta tyhjennys del (46) tai backspace (8) näppäimestä
		$("#matkaraportti_loppu_pvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#matkaraportti_loppu_pvm"));
			}
		});

		$("#matkalatausRuutu").dialog({
			autoOpen: false,
			title: "Haetaan matkoja...",
			width: 350,
			dialogClass: "ei_sulku_painiketta",
		});

		$("#matkaTietoRuutu").dialog({
			autoOpen: false,
			modal: true,
			width: 650,
			buttons: [
				{
					class: "oikeapainike",
					text: "Tallenna",
					click: function () {
						matka_tallenna_matka();
					},
				},
				{
					class: "keskipainike",
					text: "Poista",
					click: function () {
						matka_nayta_matkaPoistoRuutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Peruuta",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		$("#matkalahetysTietoRuutu").dialog({
			autoOpen: false,
			modal: true,
			title: "Matkojen lähetys tarkistettavaksi",
			width: 850,
			buttons: [
				{
					class: "oikeapainike",
					text: "Lähetä tarkistettavaksi",
					click: function () {
						matka_nayta_lahetysvahvistusruutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Peruuta",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		$("#matkavahvistusRuutu").dialog({
			autoOpen: false,
			modal: true,
			title: "Matkojen lähetys tarkistettavaksi",
			width: 650,
			buttons: [
				{
					class: "oikeapainike",
					text: "Lähetä tarkistettavaksi",
					click: function () {
						matka_laheta_matkat_tarkistettavaksi();
					},
				},
				{
					class: "vasenpainike",
					text: "Peruuta",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		$("#matkapoistoRuutu").dialog({
			autoOpen: false,
			modal: true,
			width: 650,
			title: "Poista matka",
			buttons: [
				{
					class: "oikeapainike",
					text: "Poista",
					click: function () {
						matka_poista_matka();
					},
				},
				{
					class: "vasenpainike",
					text: "Takaisin",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		$("#matkaraporttiRuutu").dialog({
			autoOpen: false,
			modal: true,
			width: 650,
			title: "Luo raportti hyväksytyistä matkoista",
			buttons: [
				{
					class: "oikeapainike",
					text: "Luo",
					click: function () {
						matka_luo_matkaraportti();
					},
				},
				{
					class: "vasenpainike",
					text: "Peruuta",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		$("#matkavalitsematkat").change(function () {
			if ($("#matkavalitsematkat").prop("checked")) {
				$("#matkalahetysvalinnat")
					.find("input[type=checkbox]")
					.each(function () {
						$(this).prop("checked", true);
						if (
							!$(this).parent().hasClass("matkalahetysvalintakehys_valittu")
						) {
							$(this).parent().addClass("matkalahetysvalintakehys_valittu");
						}
					});
			} else {
				$("#matkalahetysvalinnat")
					.find("input[type=checkbox]")
					.each(function () {
						$(this).prop("checked", false);
						$(this).parent().removeClass("matkalahetysvalintakehys_valittu");
					});
			}
		});

		$("#matkaselite").on("input", function () {
			$("#matkaselitemerkkimaara").html(90 - $("#matkaselite").val().length);
		});

		matkanakyma_alustettu = true;
	}

	let tanaan = new Date();
	$("#matkavuoropvm").datepicker("setDate", tanaan);
	$("#matkavuorotieto").html("");
	$("#matkavuorotieto").hide();
	$("#matkavuoro").show();
	$("#matkaTietoRuutu .ui-datepicker-trigger").show();
	$("#matkavalitsematkat").prop("checked", false);
	$(".matkaraporttikentta").val("");
	$("#matka_maara").html("Ei matkoja");
	$("#matka_km_yht").html("-");
	$("#matka_hyvaksytty_matkamaara").html("- kpl");
	$.datepicker._clearDate($("#matkalahetys_alku_pvm"));
	$.datepicker._clearDate($("#matkalahetys_loppu_pvm"));
	$.datepicker._clearDate($("#matkaraportti_alku_pvm"));
	$.datepicker._clearDate($("#matkaraportti_loppu_pvm"));
	$("#matkalahetysvalinnat").html("");

	matka_hae_matkat();
}

function matka_aseta_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == matka_jarjestysarvo) {
		if (matka_jarjestys == "DESC") {
			matka_jarjestys = "ASC";
		} else {
			matka_jarjestys = "DESC";
		}
	} else {
		matka_jarjestysarvo = jarjestysarvo;
		matka_jarjestys = "ASC";
	}

	matka_hae_matkat();
}

function matka_hae_matkat() {
	const sijainen_id = $("#matka_sijainenid").html();
	const tilat = [0, 2];

	if (sijainen_id != "") {
		$.post(
			"php/hae_sijaisen_matkat.php",
			{
				sijainen_id,
				tilat,
				jarjestettavaarvo: matka_jarjestysarvo,
				jarjestys: matka_jarjestys,
			},
			function (reply) {
				if (reply == "parametri") {
					alert("Parametrivirhe");
				} else if (reply.indexOf("Tietokantavirhe:") == -1) {
					let replyObj = JSON.parse(reply);
					$("#matkatauludata").html("");
					const tanaan = new Date();
					$("#matka_km_yht").html(
						"(" +
							tanaan.getFullYear() +
							") Hyväksytyt kilometrit yhteensä: " +
							replyObj["km_yht"] +
							" km"
					);

					let matkamaara = replyObj["matkamaara"];
					if (matkamaara > 0) {
						if (matkamaara == 1) {
							$("#matka_maara").html(matkamaara + " matka");
						} else {
							$("#matka_maara").html(matkamaara + " matkaa");
						}
					} else {
						$("#matkatauludata").append(
							"<tr><td colspan='7'><span>Ei matkoja</span></td></tr>"
						);
						$("#matka_maara").html("Ei matkoja");
					}

					for (let i = 0; i < replyObj["matkat"].length; i++) {
						let id = replyObj["matkat"][i].id;
						let tila =
							replyObj["matkat"][i].tila == "0"
								? "matka_ei_lahetetty"
								: "matka_hylatty";

						$("#matkatauludata").append(
							"<tr id='matka_rivi_" +
								id +
								"' class='" +
								tila +
								"'>" +
								"<td><span id='matka_pvm_" +
								id +
								"'>" +
								replyObj["matkat"][i].pvm +
								"</span></td>" +
								"<td><span id='matka_vuoro_" +
								id +
								"'>" +
								replyObj["matkat"][i].vuorotyyppi +
								" (" +
								replyObj["matkat"][i].osasto +
								")" +
								"</span></td>" +
								"<td><span id='matka_matka_" +
								id +
								"'>" +
								replyObj["matkat"][i].matka +
								"</span></td>" +
								"<td><span id='matka_selite_" +
								id +
								"'>" +
								replyObj["matkat"][i].selite +
								"</span></td>" +
								"<td><span id='matka_lahtoaika_" +
								id +
								"'>" +
								replyObj["matkat"][i].lahtoaika +
								"</span></td>" +
								"<td><span id='matka_paluuaika_" +
								id +
								"'>" +
								replyObj["matkat"][i].paluuaika +
								"</span></td>" +
								"<td><span id='matka_km_" +
								id +
								"'>" +
								replyObj["matkat"][i].km +
								"</span></td>" +
								"</tr>"
						);

						$("#matka_rivi_" + id).on("dblclick", function () {
							matka_nayta_tietoruutu(
								$(this).prop("id").replace("matka_rivi_", "")
							);
						});
					}
				} else {
					alert("Tietokantavirhe");
				}
			}
		);
	}
}

function matka_hae_vuorovalinnat(vuosi, kuukausi) {
	const sijainen_id = $("#matka_sijainenid").html();
	if (sijainen_id != "") {
		$.post(
			"php/hae_sijaisen_vuorot.php",
			{ vuosi, kuukausi, sijainen_id },
			function (reply) {
				if (reply == "parametri") {
					alert("Parametrivirhe");
				} else if (reply.indexOf("Tietokantavirhe:") == -1) {
					let replyObj = JSON.parse(reply);
					matka_sijaisen_vuorot = replyObj;
					$("#matkavuoropvm").datepicker("refresh");
				} else {
					alert("Tietokantavirhe");
				}
			}
		);
	}
}

function matka_aseta_vuorovalinnat(pvm) {
	$("#matkavuoro").html("");
	const vuorot = matka_sijaisen_vuorot[pvm];
	if (vuorot) {
		$("#matkavuoro").html(
			vuorot.map(
				(vuoro) =>
					`<option value='${vuoro.id}'>${vuoro.vuorotyyppi} - ${vuoro.osasto}, ${vuoro.tausta}</option>`
			)
		);
	}
}

function matka_nayta_tietoruutu(matka_id) {
	$("#matkaTietoRuutu")
		.next(".ui-dialog-buttonpane")
		.find("button:contains('Poista')")
		.hide();
	$("#matkaid").html("");
	$("#matkavuoroid").html("");
	$("#matkamatka").val("");
	$("#matkaselite").val("");
	$("#matkaselitemerkkimaara").html(90);
	$("#matkalahtoaika").val("");
	$("#matkapaluuaika").val("");
	$("#matkakm").val("");
	$("#matkavuorotieto").html("");
	$("#matkavuorotieto").hide();
	$("#matkaTietoRuutu").dialog("option", "title", "Uusi matka");
	$("#matkavuoro").html("<option value='-1'>Valitse päivämäärä</option>");
	$("#matkavuoro").show();
	$("#matkaTietoRuutu .ui-datepicker-trigger").show();

	if (matka_id !== "") {
		$("#matkaTietoRuutu").dialog("option", "title", "Muokkaa matkaa");
		$("#matkaid").html(matka_id);

		$.post("php/hae_matkan_tiedot.php", { matka_id }, function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "[]":
						alert("Matkan tietoja ei löytynyt");
						break;

					case "parametri":
						alert("Parametrivirhe");
						break;

					default:
						let replyObj = JSON.parse(reply);
						$("#matkavuoro").hide();
						$("#matkaTietoRuutu .ui-datepicker-trigger").hide();
						$("#matkavuorotieto").html(replyObj[0].vuoro);
						$("#matkavuorotieto").show();
						$("#matkavuoroid").html(replyObj[0].vuoro_id);
						$("#matkamatka").val(replyObj[0].matka);
						$("#matkaselite").val(replyObj[0].selite);
						$("#matkaselitemerkkimaara").html(90 - replyObj[0].selite.length);
						$("#matkalahtoaika").val(replyObj[0].lahtoaika);
						$("#matkapaluuaika").val(replyObj[0].paluuaika);
						$("#matkakm").val(replyObj[0].km);

						if (replyObj[0].tila == 0 || replyObj[0].tila == 2) {
							$("#matkaTietoRuutu")
								.next(".ui-dialog-buttonpane")
								.find("button:contains('Poista')")
								.show();
						}

						$("#matkaTietoRuutu").dialog("open");
				}
			}
		});
	} else {
		$("#matkaTietoRuutu").dialog("open");
	}
}

function matka_tallenna_matka() {
	const sijainen_id = $("#matka_sijainenid").html();
	const matka_id = $("#matkaid").html();
	const vuoro_id =
		matka_id == "" ? $("#matkavuoro").val() : $("#matkavuoroid").html();
	const pvm = $("#matkavuoropvm").val();
	const matka = $("#matkamatka").val();
	const selite = $("#matkaselite").val();
	const lahtoaika = $("#matkalahtoaika").val();
	const paluuaika = $("#matkapaluuaika").val();
	const km = $("#matkakm").val();

	if (matka_id == "") {
		if (
			sijainen_id == "" ||
			vuoro_id == -1 ||
			pvm == "" ||
			matka == "" ||
			lahtoaika == "" ||
			paluuaika == "" ||
			km == ""
		) {
			alert("Tarkista tiedot");
			return;
		}
	} else if (
		vuoro_id == "" ||
		matka == "" ||
		lahtoaika == "" ||
		paluuaika == "" ||
		km == ""
	) {
		alert("Tarkista tiedot");
		return;
	}

	$.post(
		"php/tallenna_matka.php",
		{
			id: matka_id,
			sijainen_id,
			vuoro_id,
			pvm,
			matka,
			selite,
			lahtoaika,
			paluuaika,
			km,
		},
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") != -1) {
				alert("Tietokantavirhe");
			} else {
				switch (reply) {
					case "parametri":
						alert("Parametrivirhe");
						break;

					default:
						nayta_tilaviesti("Matkan lisäys/päivitys onnistui");
						matka_hae_matkat();
						if (matka_id == "") {
							$("#matkaTietoRuutu")
								.next(".ui-dialog-buttonpane")
								.find("button:contains('Poista')")
								.hide();
							$("#matkaid").html("");
							$("#matkamatka").val("");
							$("#matkaselite").val("");
							$("#matkaselitemerkkimaara").html(90);
							$("#matkalahtoaika").val("");
							$("#matkapaluuaika").val("");
							$("#matkakm").val("");
							$("#matkaTietoRuutu").dialog("option", "title", "Uusi matka");
							$("#matkavuoro").html(
								"<option value='-1'>Valitse päivämäärä</option>"
							);
						} else {
							$("#matkaTietoRuutu").dialog("close");
						}
				}
			}
		}
	);
}

function matka_nayta_matkaPoistoRuutu() {
	let id = $("#matkaid").html();
	$("#matka_poisto_id").html(id);
	let teksti = "Haluatko poistaa matkan ?";
	$("#matka_poisto_teksti").html(
		$("#matkavuorotieto").html() +
			"</br>" +
			$("#matkaselite").val() +
			" " +
			$("#matkakm").val()
	);
	$("#matkapoistoRuutu").dialog("option", "title", teksti);
	$("#matkapoistoRuutu").dialog("open");
}

function matka_poista_matka() {
	let id = $("#matka_poisto_id").html();

	if (id == "") {
		alert("Id virhe");
		return;
	}

	$.post("php/poista_matka.php", { id }, function (reply) {
		if (reply == "parametri") {
			alert("Parametrivirhe");
		} else if (reply.indexOf("Tietokantavirhe:") == -1) {
			nayta_tilaviesti("Matkan poisto onnistui");
			$("#matka_poisto_id").html("");
			$("#matka_poisto_teksti").html("");
			matka_hae_matkat();
			$("#matkaTietoRuutu").dialog("close");
			$("#matkapoistoRuutu").dialog("close");
		} else {
			alert("Tietokantavirhe");
		}
	});
}

function matka_nayta_lahetysruutu() {
	$.datepicker._clearDate($("#matkalahetys_alku_pvm"));
	$.datepicker._clearDate($("#matkalahetys_loppu_pvm"));
	$("#matkalahetysvalinnat").html("");
	$("#matkavalitsematkat").prop("checked", false);

	$("#matkalahetysTietoRuutu").dialog("open");
}

function matka_hae_lahettavat_matkat() {
	$("#matkalahetysvalinnat").html("");
	const sijainen_id = $("#matka_sijainenid").html();
	const alkupvm = $("#matkalahetys_alku_pvm").val();
	const loppupvm = $("#matkalahetys_loppu_pvm").val();
	const tilat = [0, 2];

	if (sijainen_id != "") {
		$.post(
			"php/hae_sijaisen_matkavalinnat.php",
			{ sijainen_id, alkupvm, loppupvm, tilat },
			function (reply) {
				if (reply.indexOf("Tietokantavirhe:") != -1) {
					alert("Tietokantavirhe");
				} else {
					switch (reply) {
						case "[]":
							$("#matkalahetysvalinnat").html(
								"<span class='matkavalintateksti'>Matkoja ei löytynyt valitulle ajanjaksolle</span>"
							);
							break;

						case "parametri":
							alert("Parametrivirhe");
							break;

						default:
							let replyObj = JSON.parse(reply);
							for (let i = 0; i < replyObj.length; i++) {
								let id = replyObj[i].id;

								const vuorotieto =
									replyObj[i].vuorotyyppi + " (" + replyObj[i].osasto + ")";
								const matkatieto =
									replyObj[i].selite != ""
										? replyObj[i].matka + ", " + replyObj[i].selite
										: replyObj[i].matka;

								$("#matkalahetysvalinnat").append(
									"<div id='matkalahetysvalintakehys_" +
										id +
										"' class='matkalahetysvalintakehys'>" +
										"<input id='matkalahetysvalinta_" +
										id +
										"' type='checkbox' value='" +
										id +
										"' class='matkalahetysValinta' />" +
										"<span id='matkalahetysvalintaTeksti_" +
										id +
										"' class='matkalahetysvalintaTeksti'>" +
										replyObj[i].pvm +
										" - " +
										vuorotieto +
										", " +
										matkatieto +
										", " +
										replyObj[i].lahtoaika +
										" - " +
										replyObj[i].paluuaika +
										", " +
										replyObj[i].km +
										"km</span>" +
										"</div>"
								);

								$("#matkalahetysvalintakehys_" + id).click(function () {
									let valinta_id = $(this)
										.prop("id")
										.replace("matkalahetysvalintakehys_", "");
									if (
										$("#matkalahetysvalinta_" + valinta_id).prop("checked") ==
										true
									) {
										$("#matkalahetysvalinta_" + valinta_id).prop(
											"checked",
											false
										);
										$("#matkavalitsematkat").prop("checked", false);
										$("#matkalahetysvalintakehys_" + valinta_id).removeClass(
											"matkalahetysvalintakehys_valittu"
										);
									} else {
										$("#matkalahetysvalinta_" + valinta_id).prop(
											"checked",
											true
										);
										if (
											!$("#matkalahetysvalintakehys_" + valinta_id).hasClass(
												"matkalahetysvalintakehys_valittu"
											)
										) {
											$("#matkalahetysvalintakehys_" + valinta_id).addClass(
												"matkalahetysvalintakehys_valittu"
											);
										}
										if (
											$("#matkalahetysvalinnat input:checked").length ==
											$("#matkalahetysvalinnat input").length
										) {
											$("#matkavalitsematkat").prop("checked", true);
										}
									}
								});

								$("#matkalahetysvalinta_" + id).click(function (
									painiketapahtuma
								) {
									painiketapahtuma.stopPropagation();
									let valinta_id = $(this)
										.prop("id")
										.replace("matkalahetysvalinta_", "");
									if ($(this).prop("checked") == false) {
										$("#matkavalitsematkat").prop("checked", false);
										$("#matkalahetysvalintakehys_" + valinta_id).removeClass(
											"matkalahetysvalintakehys_valittu"
										);
									} else {
										if (
											!$("#matkalahetysvalintakehys_" + valinta_id).hasClass(
												"matkalahetysvalintakehys_valittu"
											)
										) {
											$("#matkalahetysvalintakehys_" + valinta_id).addClass(
												"matkalahetysvalintakehys_valittu"
											);
										}
										if (
											$("#matkalahetysvalinnat input:checked").length ==
											$("#matkalahetysvalinnat input").length
										) {
											$("#matkavalitsematkat").prop("checked", true);
										}
									}
								});
							}
					}
				}
			}
		);
	}
}

function matka_nayta_lahetysvahvistusruutu() {
	if ($("#matkalahetysvalinnat input:checked").length > 0) {
		$("#matka_lahetys_teksti").html(
			"Lähetetäänkö valitut matkat tarkistettavaksi ? ( " +
				$("#matkalahetysvalinnat input:checked").length +
				"kpl )"
		);
		$("#matkavahvistusRuutu").dialog("open");
	} else {
		alert("Ei yhtään matkaa valittuna");
	}
}

function matka_laheta_matkat_tarkistettavaksi() {
	let matka_idt = "";
	$("#matkalahetysvalinnat input:checked").each(function () {
		matka_idt += ",'" + this.value + "'";
	});

	if (matka_idt.length > 0) {
		matka_idt = matka_idt.substr(1);
	} else {
		alert("Ei yhtään matkaa valittuna");
		return;
	}

	$.post(
		"php/aseta_matkat_tarkistettavaksi.php",
		{ matka_idt },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				if ($("#matkalahetysvalinnat input:checked").length > 1) {
					nayta_tilaviesti("Matkat lähetetty tarkistettavaksi");
				} else {
					nayta_tilaviesti("Matka lähetetty tarkistettavaksi");
				}

				matka_hae_matkat();
				$("#matkavalitsematkat").prop("checked", false);
				$("#matkavahvistusRuutu").dialog("close");
				matka_hae_lahettavat_matkat();
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function matka_nayta_raporttiruutu() {
	$("#matka_hyvaksytty_matkamaara").html("- kpl");
	$.datepicker._clearDate($("#matkaraportti_alku_pvm"));
	$.datepicker._clearDate($("#matkaraportti_loppu_pvm"));

	matka_hae_hyvaksytyt_matka_maarat();
	$("#matkaraporttiRuutu").dialog("open");
}

function matka_hae_hyvaksytyt_matka_maarat() {
	const sijainen_id = $("#matka_sijainenid").html();
	const alkupvm = $("#matkaraportti_alku_pvm").val();
	const loppupvm = $("#matkaraportti_loppu_pvm").val();

	$("#matka_hyvaksytty_matkamaara").html("- kpl");
	if (sijainen_id != "") {
		$.post(
			"php/hae_hyvaksyttyjen_matkojen_maarat.php",
			{ sijainen_id, alkupvm, loppupvm },
			function (reply) {
				if (reply.indexOf("Tietokantavirhe:") != -1) {
					alert("Tietokantavirhe");
				} else {
					switch (reply) {
						case "parametri":
							alert("Parametrivirhe");
							break;

						default:
							let replyObj = JSON.parse(reply);
							$("#matka_hyvaksytty_matkamaara").html(
								`${replyObj.matkamaara} kpl`
							);
					}
				}
			}
		);
	}
}

function matka_luo_matkaraportti() {
	const alku_pvm = $("#matkaraportti_alku_pvm").val();
	const loppu_pvm = $("#matkaraportti_loppu_pvm").val();
	$(".matkaraporttikentta").val("");

	const sijainen_id = $("#matka_sijainenid").html();
	if (sijainen_id != "") {
		$("#matkaraportti_sijainen_id").val(sijainen_id);
		$("#matkaraportti_alkupvm").val(alku_pvm);
		$("#matkaraportti_loppupvm").val(loppu_pvm);

		$("#matkaraporttiRuutu").dialog("close");
		$("#matkaraporttitieto").submit();
		$(".matkaraporttikentta").val("");
	}
}

/*************************************** MATKATARKISTUS ******************************************/

function alusta_matkatarkistus() {
	if (!matkatarkistus_alustettu) {
		$("#matkatarkistus_alku_pvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (dateText, inst) {
				$("#matkatarkistus_loppu_pvm").datepicker(
					"option",
					"minDate",
					dateText
				);
			},
		});

		//Aseta pvm_kentta tyhjennys del (46) tai backspace (8) näppäimestä
		$("#matkatarkistus_alku_pvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#matkatarkistus_alku_pvm"));
			}
		});

		$("#matkatarkistus_loppu_pvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (dateText, inst) {
				$("#matkatarkistus_alku_pvm").datepicker("option", "maxDate", dateText);
			},
		});

		//Aseta pvm_kentta tyhjennys del (46) tai backspace (8) näppäimestä
		$("#matkatarkistus_loppu_pvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#matkatarkistus_loppu_pvm"));
			}
		});

		$("#matkatarkistusraportti_alku_pvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (dateText, inst) {
				$("#matkatarkistusraportti_loppu_pvm").datepicker(
					"option",
					"minDate",
					dateText
				);
				matkatarkistus_hae_hyvaksytyt_matka_maarat();
			},
		});

		//Aseta pvm_kentta tyhjennys del (46) tai backspace (8) näppäimestä
		$("#matkatarkistusraportti_alku_pvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#matkatarkistusraportti_alku_pvm"));
			}
		});

		$("#matkatarkistusraportti_loppu_pvm").datepicker({
			dateFormat: "dd.mm.yy",
			regional: "fi",
			showOtherMonths: true,
			numberOfMonths: 1,
			showWeek: true,
			onSelect: function (dateText, inst) {
				$("#matkatarkistusraportti_alku_pvm").datepicker(
					"option",
					"maxDate",
					dateText
				);
				matkatarkistus_hae_hyvaksytyt_matka_maarat();
			},
		});

		//Aseta pvm_kentta tyhjennys del (46) tai backspace (8) näppäimestä
		$("#matkatarkistusraportti_loppu_pvm").keydown(function (painiketapahtuma) {
			if (painiketapahtuma.which == 8 || painiketapahtuma.which == 46) {
				$.datepicker._clearDate($("#matkatarkistusraportti_loppu_pvm"));
			}
		});

		$("#matkatarkistuslatausRuutu").dialog({
			autoOpen: false,
			title: "Haetaan matkoja...",
			width: 350,
			dialogClass: "ei_sulku_painiketta",
		});

		$("#matkatarkistusTietoRuutu").dialog({
			autoOpen: false,
			modal: true,
			title: "Matkojen tarkistus",
			width: 850,
			height: $(window).height(),
			buttons: [
				{
					class: "oikeapainike",
					text: "Hyväksy",
					click: function () {
						matkatarkistus_nayta_vahvistusruutu();
					},
				},
				{
					class: "vasenpainike",
					text: "Peruuta",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		$("#matkatarkistusvahvistusRuutu").dialog({
			autoOpen: false,
			modal: true,
			title: "Matkojen tarkistus",
			width: 650,
			buttons: [
				{
					class: "oikeapainike",
					text: "Ok",
					click: function () {
						matkatarkistus_paivita_matkat();
					},
				},
				{
					class: "vasenpainike",
					text: "Peruuta",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		$("#matkatarkistusraporttiRuutu").dialog({
			autoOpen: false,
			modal: true,
			width: 650,
			title: "Luo raportti hyväksytyistä matkoista",
			buttons: [
				{
					class: "oikeapainike",
					text: "Luo",
					click: function () {
						matkatarkistus_luo_matkaraportti();
					},
				},
				{
					class: "vasenpainike",
					text: "Peruuta",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
		});

		matkatarkistus_alustettu = true;
	}

	const tanaan = new Date();
	$(".matkatarkistus_painike").prop("disabled", true);
	$("#matkatarkistustauludata").html("");
	$(".matkatarkistusraporttikentta").val("");
	$("#matkatarkistus_maara").html("-");
	$("#matkatarkistus_nakyma_suodatin").val(0);
	$("#matkatarkistusnakymapikavalinnat .pikavalintapainikkeet").removeClass(
		"painike_valittu_tila"
	);
	$("#matkatarkistusnakymapikavalinta_hoitaja").addClass(
		"painike_valittu_tila"
	);
	$("#matkatarkistus_tarkistettavat_valinta").prop("checked", false);
	$("#matkatarkistus_km_yht").html("-");
	$("#matkatarkistus_hyvaksytty_matkamaara").html("- kpl");
	$.datepicker._clearDate($("#matkatarkistus_alku_pvm"));
	$.datepicker._clearDate($("#matkatarkistus_loppu_pvm"));
	$.datepicker._clearDate($("#matkatarkistusraportti_alku_pvm"));
	$.datepicker._clearDate($("#matkatarkistusraportti_loppu_pvm"));
	$("#matkatarkistusvalinnat").html("");

	$.when(matkatarkistus_hae_toimialue_valinnat()).then(function () {
		matkatarkistus_hae_sijaisvalinnat();
	});
}

function matkatarkistus_hae_toimialue_valinnat() {
	$("#matkatarkistus_toimialue_suodatin").html("");
	$("#matkatarkistustoimialuepikavalinnat").html(
		"<button id='matkatarkistustoimialuevalinta_0' class='toimialuepainike'>Kaikki</button>"
	);

	$("#matkatarkistustoimialuevalinta_0").click(function () {
		$("#matkatarkistustoimialuepikavalinnat button").removeClass(
			"painike_valittu_tila"
		);
		$(this).addClass("painike_valittu_tila");
		$("#matkatarkistus_toimialue_suodatin option").prop("selected", "selected");
		matkatarkistus_hae_sijaisvalinnat();
	});

	let valmis = $.Deferred();

	$.post(
		"php/hae_toimialue_valinnat.php",
		{ toimialue_idt: kayttaja_toimialue_idt },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);

				for (let i = 0; i < replyObj.length; i++) {
					$("#matkatarkistustoimialuepikavalinnat").append(
						"<button id='matkatarkistustoimialuevalinta_" +
							replyObj[i].id +
							"' class='toimialuepainike'>" +
							replyObj[i].lyhenne +
							"</button>"
					);
					$("#matkatarkistus_toimialue_suodatin").append(
						"<option value='" +
							replyObj[i].id +
							"'>" +
							replyObj[i].nimi +
							"</option>"
					);

					$("#matkatarkistustoimialuevalinta_" + replyObj[i].id).click(
						function (painiketapahtuma) {
							let toimialue_id = $(this)
								.prop("id")
								.replace("matkatarkistustoimialuevalinta_", "");
							let valitut_toimialue_idt = $(
								"#matkatarkistus_toimialue_suodatin"
							).val();

							if (
								$("#matkatarkistustoimialuevalinta_0").hasClass(
									"painike_valittu_tila"
								) &&
								$("#matkatarkistus_toimialue_suodatin option").length ==
									valitut_toimialue_idt.length
							) {
								$("#matkatarkistustoimialuepikavalinnat button").removeClass(
									"painike_valittu_tila"
								);
								$("#matkatarkistus_toimialue_suodatin")
									.val(toimialue_id)
									.change();
								$(this).addClass("painike_valittu_tila");
							} else {
								if (painiketapahtuma.ctrlKey == true) {
									if ($(this).hasClass("painike_valittu_tila")) {
										if (
											$(
												"#matkatarkistustoimialuepikavalinnat .painike_valittu_tila"
											).length > 1
										) {
											$(this).removeClass("painike_valittu_tila");
											if (valitut_toimialue_idt.indexOf(toimialue_id) >= 0) {
												valitut_toimialue_idt.splice(
													valitut_toimialue_idt.indexOf(toimialue_id),
													1
												);
											}
											$("#matkatarkistus_toimialue_suodatin")
												.val(valitut_toimialue_idt)
												.change();
										}
									} else {
										valitut_toimialue_idt.push(toimialue_id);
										$("#matkatarkistus_toimialue_suodatin")
											.val(valitut_toimialue_idt)
											.change();
										if (
											$("#matkatarkistus_toimialue_suodatin option").length ==
											valitut_toimialue_idt.length
										) {
											$(
												"#matkatarkistustoimialuepikavalinnat button"
											).removeClass("painike_valittu_tila");
											$("#matkatarkistustoimialuevalinta_0").addClass(
												"painike_valittu_tila"
											);
										} else {
											$(this).addClass("painike_valittu_tila");
										}
									}
								} else {
									$("#matkatarkistustoimialuepikavalinnat button").removeClass(
										"painike_valittu_tila"
									);
									$("#matkatarkistus_toimialue_suodatin")
										.val(toimialue_id)
										.change();
									$(this).addClass("painike_valittu_tila");
								}
							}
						}
					);
				}

				$("#matkatarkistustoimialuepikavalinnat button").button();
				$("#matkatarkistustoimialuevalinta_0").addClass("painike_valittu_tila");
				$("#matkatarkistus_toimialue_suodatin option").prop(
					"selected",
					"selected"
				);
			} else {
				alert("Tietokantavirhe");
			}

			valmis.resolve();
		}
	);

	return valmis;
}

function matkatarkistus_vaihda_nakyma(hoitajatila) {
	$("#matkatarkistusnakymapikavalinnat button").removeClass(
		"painike_valittu_tila"
	);
	if (hoitajatila) {
		$("#matkatarkistus_nakyma_suodatin").val(0).change();
		$("#matkatarkistusnakymapikavalinta_hoitaja").addClass(
			"painike_valittu_tila"
		);
	} else {
		$("#matkatarkistus_nakyma_suodatin").val(1).change();
		$("#matkatarkistusnakymapikavalinta_sihteeri").addClass(
			"painike_valittu_tila"
		);
	}
}

function matkatarkistus_hae_sijaisvalinnat() {
	const toimialue_idt = $("#matkatarkistus_toimialue_suodatin").val();
	const tila = $("#matkatarkistus_nakyma_suodatin").val();
	let matkatarkistustila = 0;
	if ($("#matkatarkistus_tarkistettavat_valinta").prop("checked")) {
		matkatarkistustila = 1;
	}
	$("#matkatarkistus_maara").html("-");
	$("#matkatarkistus_km_yht").html("-");
	$("#matkatarkistustauludata").html("");
	$(".matkatarkistus_painike").prop("disabled", true);

	$.post(
		"php/hae_matkatarkistus_sijaisvalinnat.php",
		{ toimialue_idt, tila, matkatarkistustila },
		function (reply) {
			if (reply.indexOf("Tietokantavirhe:") == -1) {
				let replyObj = JSON.parse(reply);
				if (replyObj.length > 0) {
					$("#matkatarkistus_sijainen").html(
						"<option value='' selected hidden>Valitse sissi</option>"
					);
					let sijaisvalinnat = "";
					for (let i = 0; i < replyObj.length; i++) {
						sijaisvalinnat +=
							"<option value='" +
							replyObj[i].sijainen_id +
							"'>" +
							replyObj[i].nimi +
							"</option>";
					}

					$("#matkatarkistus_sijainen").append(sijaisvalinnat);
				} else {
					$("#matkatarkistus_sijainen").html(
						"<option value='' selected hidden>Ei sissejä</option>"
					);
				}
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function matkatarkistus_aseta_sijainen() {
	if ($("#matkatarkistus_sijainen").val() != "") {
		$(".matkatarkistus_painike").prop("disabled", false);
		matkatarkistus_hae_matkat();
	}
}

function matkatarkistus_aseta_jarjestys(jarjestysarvo) {
	if (jarjestysarvo == matkatarkistus_jarjestysarvo) {
		if (matkatarkistus_jarjestys == "DESC") {
			matkatarkistus_jarjestys = "ASC";
		} else {
			matkatarkistus_jarjestys = "DESC";
		}
	} else {
		matkatarkistus_jarjestysarvo = jarjestysarvo;
		matkatarkistus_jarjestys = "ASC";
	}

	matkatarkistus_hae_matkat();
}

function matkatarkistus_hae_matkat() {
	const sijainen_id = $("#matkatarkistus_sijainen").val();
	const tilat = [1];

	if (sijainen_id != "") {
		$.post(
			"php/hae_sijaisen_matkat.php",
			{
				sijainen_id,
				tilat,
				jarjestettavaarvo: matkatarkistus_jarjestysarvo,
				jarjestys: matkatarkistus_jarjestys,
			},
			function (reply) {
				if (reply == "parametri") {
					alert("Parametrivirhe");
				} else if (reply.indexOf("Tietokantavirhe:") == -1) {
					let replyObj = JSON.parse(reply);
					$("#matkatarkistustauludata").html("");

					let matkatarkistusmaara = replyObj["matkamaara"];
					if (matkatarkistusmaara > 0) {
						if (matkatarkistusmaara == 1) {
							$("#matkatarkistus_maara").html(matkatarkistusmaara + " matka");
						} else {
							$("#matkatarkistus_maara").html(matkatarkistusmaara + " matkaa");
						}
					} else {
						$("#matkatarkistustauludata").append(
							"<tr><td colspan='7'><span>Ei matkoja</span></td></tr>"
						);
						$("#matkatarkistus_maara").html("Ei matkoja");
					}

					const tanaan = new Date();
					$("#matkatarkistus_km_yht").html(
						"(" +
							tanaan.getFullYear() +
							") Hyväksytyt kilometrit yhteensä: " +
							replyObj["km_yht"] +
							" km"
					);

					for (let i = 0; i < replyObj["matkat"].length; i++) {
						let id = replyObj["matkat"][i].id;

						$("#matkatarkistustauludata").append(
							"<tr id='matkatarkistus_rivi_" +
								id +
								"'>" +
								"<td><span id='matkatarkistus_pvm_" +
								id +
								"'>" +
								replyObj["matkat"][i].pvm +
								"</span></td>" +
								"<td><span id='matkatarkistus_vuoro_" +
								id +
								"'>" +
								replyObj["matkat"][i].vuorotyyppi +
								" (" +
								replyObj["matkat"][i].osasto +
								")" +
								"</span></td>" +
								"<td><span id='matkatarkistus_matka_" +
								id +
								"'>" +
								replyObj["matkat"][i].matka +
								"</span></td>" +
								"<td><span id='matkatarkistus_selite_" +
								id +
								"'>" +
								replyObj["matkat"][i].selite +
								"</span></td>" +
								"<td><span id='matkatarkistus_lahtoaika_" +
								id +
								"'>" +
								replyObj["matkat"][i].lahtoaika +
								"</span></td>" +
								"<td><span id='matkatarkistus_paluuaika_" +
								id +
								"'>" +
								replyObj["matkat"][i].paluuaika +
								"</span></td>" +
								"<td><span id='matkatarkistus_km_" +
								id +
								"'>" +
								replyObj["matkat"][i].km +
								"</span></td>" +
								"</tr>"
						);
					}
				} else {
					alert("Tietokantavirhe");
				}
			}
		);
	}
}

function matkatarkistus_nayta_tarkistusruutu() {
	$("#matkatarkistusTietoRuutu").dialog(
		"option",
		"title",
		"Matkojen tarkistus - " +
			$("#matkatarkistus_sijainen  option:selected").html()
	);
	$("#matkatarkistusvalinnat").html("");
	$.datepicker._clearDate($("#matkatarkistus_alku_pvm"));
	$.datepicker._clearDate($("#matkatarkistus_loppu_pvm"));
	$("#matkatarkistusTietoRuutu").dialog("open");
}

function matkatarkistus_hae_tarkistettavat_matkat() {
	$("#matkatarkistusvalinnat").html("");
	const sijainen_id = $("#matkatarkistus_sijainen").val();
	const tilat = [1];
	const alkupvm = $("#matkatarkistus_alku_pvm").val();
	const loppupvm = $("#matkatarkistus_loppu_pvm").val();

	if (sijainen_id != "") {
		$.post(
			"php/hae_sijaisen_matkavalinnat.php",
			{ sijainen_id, alkupvm, loppupvm, tilat },
			function (reply) {
				if (reply.indexOf("Tietokantavirhe:") != -1) {
					alert("Tietokantavirhe");
				} else {
					switch (reply) {
						case "[]":
							$("#matkatarkistusvalinnat").html(
								"<span class='matkatarkistusvalintateksti'>Tarkistettavia matkoja ei löytynyt valitulle ajanjaksolle</span>"
							);
							break;

						case "parametri":
							alert("Parametrivirhe");
							break;

						default:
							let replyObj = JSON.parse(reply);
							for (let i = 0; i < replyObj.length; i++) {
								let id = replyObj[i].id;

								const vuorotieto =
									replyObj[i].vuorotyyppi + " (" + replyObj[i].osasto + ")";
								const matkatieto =
									replyObj[i].selite != ""
										? replyObj[i].matka + ", " + replyObj[i].selite
										: replyObj[i].matka;

								$("#matkatarkistusvalinnat").append(
									"<div id='matkatarkistusvalintakehys_" +
										id +
										"' class='matkatarkistusvalintakehys'>" +
										"<span id='matkatarkistusvalintaTeksti_" +
										id +
										"' class='matkatarkistusvalintaTeksti'>" +
										replyObj[i].pvm +
										" - " +
										vuorotieto +
										", " +
										matkatieto +
										", " +
										replyObj[i].lahtoaika +
										" - " +
										replyObj[i].paluuaika +
										", " +
										replyObj[i].km +
										"km</span>" +
										"<div class='matkatarkistusvalintatarkistuskehys'>" +
										"<input id='matkatarkistusvalintapalauta_" +
										id +
										"' type='radio' name='matkatarkistusvalintatila_" +
										id +
										"' value='2' class='matkatarkistus_palauta_valinta' />" +
										"<label for='matkatarkistusvalintapalauta_" +
										id +
										"'>Palauta</label>" +
										"<input id='matkatarkistusvalintahyvaksy_" +
										id +
										"' type='radio' name='matkatarkistusvalintatila_" +
										id +
										"' value='3' class='matkatarkistus_hyvaksy_valinta' />" +
										"<label for='matkatarkistusvalintahyvaksy_" +
										id +
										"'>Hyväksy</label>" +
										"</div>" +
										"</div>"
								);

								$("#matkatarkistusvalintapalauta_" + id).click(function () {
									const id = $(this)
										.prop("id")
										.replace("matkatarkistusvalintapalauta_", "");
									if (
										!$("#matkatarkistusvalintakehys_" + id).hasClass(
											"matkatarkistus_palautettava"
										)
									) {
										$("#matkatarkistusvalintakehys_" + id).removeClass(
											"matkatarkistus_hyvaksytty"
										);
										$("#matkatarkistusvalintakehys_" + id).addClass(
											"matkatarkistus_palautettava"
										);
									}
								});

								$("#matkatarkistusvalintahyvaksy_" + id).click(function () {
									const id = $(this)
										.prop("id")
										.replace("matkatarkistusvalintahyvaksy_", "");
									if (
										!$("#matkatarkistusvalintakehys_" + id).hasClass(
											"matkatarkistus_hyvaksytty"
										)
									) {
										$("#matkatarkistusvalintakehys_" + id).removeClass(
											"matkatarkistus_palautettava"
										);
										$("#matkatarkistusvalintakehys_" + id).addClass(
											"matkatarkistus_hyvaksytty"
										);
									}
								});
							}
					}
				}
			}
		);
	}
}

function matkatarkistus_palauta_kaikki() {
	$(".matkatarkistus_palauta_valinta").prop("checked", true);

	$(".matkatarkistusvalintakehys").each(function () {
		if (!$(this).hasClass("matkatarkistus_palautettava")) {
			$(this).removeClass("matkatarkistus_hyvaksytty");
			$(this).addClass("matkatarkistus_palautettava");
		}
	});
}

function matkatarkistus_hyvaksy_kaikki() {
	$(".matkatarkistus_hyvaksy_valinta").prop("checked", true);

	$(".matkatarkistusvalintakehys").each(function () {
		if (!$(this).hasClass("matkatarkistus_hyvaksytty")) {
			$(this).removeClass("matkatarkistus_palautettava");
			$(this).addClass("matkatarkistus_hyvaksytty");
		}
	});
}

function matkatarkistus_nayta_vahvistusruutu() {
	if ($("#matkatarkistusvalinnat input:checked").length > 0) {
		const hylatty =
			$(".matkatarkistus_palauta_valinta:checked").length > 0
				? $(".matkatarkistus_palauta_valinta:checked").length == 1
					? "Palautetaanko " +
					  $(".matkatarkistus_palauta_valinta:checked").length +
					  " matka ?"
					: "Palautetaanko " +
					  $(".matkatarkistus_palauta_valinta:checked").length +
					  " matkaa ?"
				: "";

		const hyvaksytty =
			$(".matkatarkistus_hyvaksy_valinta:checked").length > 0
				? $(".matkatarkistus_hyvaksy_valinta:checked").length == 1
					? "Hyväksytäänkö " +
					  $(".matkatarkistus_hyvaksy_valinta:checked").length +
					  " matka ?"
					: "Hyväksytäänkö " +
					  $(".matkatarkistus_hyvaksy_valinta:checked").length +
					  " matkaa ?"
				: "";

		if (hylatty != "" && hyvaksytty != "") {
			$("#matkatarkistus_yhteenveto").html(hylatty + "</br>" + hyvaksytty);
		} else {
			$("#matkatarkistus_yhteenveto").html(hylatty + hyvaksytty);
		}

		$("#matkatarkistusvahvistusRuutu").dialog("open");
	} else {
		alert("Ei yhtään matkaa tarkistettu");
	}
}

function matkatarkistus_paivita_matkat() {
	let palautettavat_matka_idt = "";
	$(".matkatarkistus_palauta_valinta:checked").each(function () {
		const matka_id = $(this)
			.prop("id")
			.replace("matkatarkistusvalintapalauta_", "");
		palautettavat_matka_idt += ",'" + matka_id + "'";
	});

	if (palautettavat_matka_idt.length > 0) {
		palautettavat_matka_idt = palautettavat_matka_idt.substr(1);
	}

	let hyvaksytyt_matka_idt = "";
	$(".matkatarkistus_hyvaksy_valinta:checked").each(function () {
		const matka_id = $(this)
			.prop("id")
			.replace("matkatarkistusvalintahyvaksy_", "");
		hyvaksytyt_matka_idt += ",'" + matka_id + "'";
	});

	if (hyvaksytyt_matka_idt.length > 0) {
		hyvaksytyt_matka_idt = hyvaksytyt_matka_idt.substr(1);
	}

	if (hyvaksytyt_matka_idt.length == 0 && palautettavat_matka_idt.length == 0) {
		alert("Ei yhtään matkaa tarkistettu");
		return;
	}

	$.post(
		"php/aseta_matka_tarkistukset.php",
		{ palautettavat_matka_idt, hyvaksytyt_matka_idt },
		function (reply) {
			if (reply == "parametri") {
				alert("Parametrivirhe");
			} else if (reply.indexOf("Tietokantavirhe:") == -1) {
				let vastaus = JSON.parse(reply);
				const palautettu =
					vastaus.palautetut_rivi_paivitykset > 0
						? vastaus.palautetut_rivi_paivitykset == 1
							? "Palautettu " +
							  $(".matkatarkistus_palauta_valinta:checked").length +
							  " matka"
							: "Palautettu " +
							  $(".matkatarkistus_palauta_valinta:checked").length +
							  " matkaa"
						: "";

				const hyvaksytty =
					vastaus.hyvaksytyt_rivi_paivitykset > 0
						? vastaus.hyvaksytyt_rivi_paivitykset == 1
							? "Hyväksytty " +
							  $(".matkatarkistus_hyvaksy_valinta:checked").length +
							  " matka"
							: "Hyväksytty " +
							  $(".matkatarkistus_hyvaksy_valinta:checked").length +
							  " matkaa"
						: "";

				if (palautettu != "" && hyvaksytty != "") {
					nayta_tilaviesti(palautettu + ", " + hyvaksytty);
				} else {
					nayta_tilaviesti(palautettu + hyvaksytty);
				}

				matkatarkistus_hae_matkat();
				matkatarkistus_hae_tarkistettavat_matkat();
				$("#matkatarkistusvahvistusRuutu").dialog("close");
			} else {
				alert("Tietokantavirhe");
			}
		}
	);
}

function matkatarkistus_nayta_raporttiruutu() {
	$("#matkatarkistusraporttiRuutu").dialog(
		"option",
		"title",
		"Luo raportti hyväksytyistä matkoista - " +
			$("#matkatarkistus_sijainen  option:selected").html()
	);
	$("#matkatarkistus_hyvaksytty_matkamaara").html("- kpl");
	$.datepicker._clearDate($("#matkatarkistusraportti_alku_pvm"));
	$.datepicker._clearDate($("#matkatarkistusraportti_loppu_pvm"));
	matkatarkistus_hae_hyvaksytyt_matka_maarat();
	$("#matkatarkistusraporttiRuutu").dialog("open");
}

function matkatarkistus_hae_hyvaksytyt_matka_maarat() {
	const sijainen_id = $("#matkatarkistus_sijainen").val();
	const alkupvm = $("#matkatarkistusraportti_alku_pvm").val();
	const loppupvm = $("#matkatarkistusraportti_loppu_pvm").val();

	$("#matkatarkistus_hyvaksytty_matkamaara").html("- kpl");
	if (sijainen_id != "") {
		$.post(
			"php/hae_hyvaksyttyjen_matkojen_maarat.php",
			{ sijainen_id, alkupvm, loppupvm },
			function (reply) {
				if (reply.indexOf("Tietokantavirhe:") != -1) {
					alert("Tietokantavirhe");
				} else {
					switch (reply) {
						case "parametri":
							alert("Parametrivirhe");
							break;

						default:
							let replyObj = JSON.parse(reply);
							$("#matkatarkistus_hyvaksytty_matkamaara").html(
								`${replyObj.matkamaara} kpl`
							);
					}
				}
			}
		);
	}
}

function matkatarkistus_luo_matkaraportti() {
	const alkupvm = $("#matkatarkistusraportti_alku_pvm").val();
	const loppupvm = $("#matkatarkistusraportti_loppu_pvm").val();
	$(".matkatarkistusraporttikentta").val("");

	const sijainen_id = $("#matkatarkistus_sijainen").val();
	if (sijainen_id != "") {
		$("#matkatarkistusraportti_sijainen_id").val(sijainen_id);
		$("#matkatarkistusraportti_alkupvm").val(alkupvm);
		$("#matkatarkistusraportti_loppupvm").val(loppupvm);

		$("#matkatarkistusraporttiRuutu").dialog("close");
		$("#matkatarkistusraporttitieto").submit();
		$(".matkatarkistusraporttikentta").val("");
	}
}

/************************************************************************ */

$.fn.varivalinta = function () {
	let leveys = $(".varikehys").width();
	let varikartta_korkeus = $(".varikarttakehys").height();
	let varikaista_korkeus = $(".varikaistakehys").height();
	$(".varikarttakehys").append(
		"<canvas class='varikartta' width=" +
			leveys +
			"px' height='" +
			varikartta_korkeus +
			"px'></canvas>"
	);
	$(".varikaistakehys").append(
		"<canvas class='varikaista' width='" +
			leveys +
			"px' height='" +
			varikaista_korkeus +
			"px'></canvas>"
	);

	$(".varikartta").click(function (painiketapahtuma) {
		painiketapahtuma.stopPropagation();
		let indikaattori = $(this).siblings(".varikartta_indikaattori");
		indikaattori.css({
			top: painiketapahtuma.offsetY - indikaattori.outerWidth() / 2 + "px",
			left: painiketapahtuma.offsetX - indikaattori.outerWidth() / 2 + "px",
		});
		let varikartta_alue = $(this)[0].getContext("2d");
		let varitiedot = varikartta_alue.getImageData(
			painiketapahtuma.offsetX,
			painiketapahtuma.offsetY,
			1,
			1
		).data;
		let varivalinta = $(this).data("kohde");
		varivalinta.css(
			"background-color",
			"rgba(" +
				varitiedot[0] +
				"," +
				varitiedot[1] +
				"," +
				varitiedot[2] +
				",1)"
		);

		let hex = "";
		let hex_r = varitiedot[0].toString(16);
		let hex_g = varitiedot[1].toString(16);
		let hex_b = varitiedot[2].toString(16);
		if (hex_r < 16) {
			hex_r += "0";
		}
		if (hex_g < 16) {
			hex_g += "0";
		}
		if (hex_b < 16) {
			hex_b += "0";
		}
		hex = "#" + hex_r + hex_g + hex_b;
		varivalinta.data("vari", hex.toUpperCase());
	});

	$(".varikartta").mousemove(function (hiiritapahtuma) {
		if (hiiritapahtuma.buttons == 1) {
			let indikaattori = $(this).siblings(".varikartta_indikaattori");
			indikaattori.css({
				top: hiiritapahtuma.offsetY - indikaattori.outerWidth() / 2 + "px",
				left: hiiritapahtuma.offsetX - indikaattori.outerWidth() / 2 + "px",
			});
			let varikartta_alue = $(this)[0].getContext("2d");
			let varitiedot = varikartta_alue.getImageData(
				hiiritapahtuma.offsetX,
				hiiritapahtuma.offsetY,
				1,
				1
			).data;
			let varivalinta = $(this).data("kohde");
			varivalinta.css(
				"background-color",
				"rgba(" +
					varitiedot[0] +
					"," +
					varitiedot[1] +
					"," +
					varitiedot[2] +
					",1)"
			);
			let hex = "";
			let hex_r = varitiedot[0].toString(16);
			let hex_g = varitiedot[1].toString(16);
			let hex_b = varitiedot[2].toString(16);
			if (hex_r < 16) {
				hex_r += "0";
			}
			if (hex_g < 16) {
				hex_g += "0";
			}
			if (hex_b < 16) {
				hex_b += "0";
			}
			hex = "#" + hex_r + hex_g + hex_b;
			varivalinta.data("vari", hex.toUpperCase());
		}
	});

	let varikartta_indikaattori = $(".varikartta_indikaattori");
	varikartta_indikaattori.click(function (painiketapahtuma) {
		painiketapahtuma.stopPropagation();
	});

	let varikaista_alue = $(".varikaista")[0].getContext("2d");
	varikaista_alue.rect(0, 0, leveys, varikaista_korkeus);
	let varikaista_alue_varitys = varikaista_alue.createLinearGradient(
		0,
		0,
		leveys,
		0
	);
	varikaista_alue_varitys.addColorStop(0, "rgba(255,0,0,1)");
	varikaista_alue_varitys.addColorStop(0.17, "rgba(255,255,0,1)");
	varikaista_alue_varitys.addColorStop(0.34, "rgba(0,255,0,1)");
	varikaista_alue_varitys.addColorStop(0.51, "rgba(0,255,255,1)");
	varikaista_alue_varitys.addColorStop(0.68, "rgba(0,0,255,1)");
	varikaista_alue_varitys.addColorStop(0.85, "rgba(255,0,255,1)");
	varikaista_alue_varitys.addColorStop(1, "rgba(255,0,0,1)");
	varikaista_alue.fillStyle = varikaista_alue_varitys;
	varikaista_alue.fill();

	$(".varikaista").click(function (painiketapahtuma) {
		painiketapahtuma.stopPropagation();
		let indikaattori = $(this).siblings(".varikaista_indikaattori");
		indikaattori.css({
			left: painiketapahtuma.offsetX - indikaattori.outerWidth() / 2 + "px",
		});
		let leveys = $(this).closest(".varikehys").width();
		let varikartta_korkeus = $(this)
			.closest(".varikehys")
			.find(".varikarttakehys")
			.height();
		let varikartta = $(this).closest(".varikehys").find(".varikartta")[0];
		let varikartta_alue = varikartta.getContext("2d");
		let varikaista_alue = $(this)[0].getContext("2d");

		let varitiedot = varikaista_alue.getImageData(
			painiketapahtuma.offsetX,
			painiketapahtuma.offsetY,
			1,
			1
		).data;
		varikartta_alue.fillStyle =
			"rgba(" +
			varitiedot[0] +
			"," +
			varitiedot[1] +
			"," +
			varitiedot[2] +
			",1)";
		varikartta_alue.fillRect(0, 0, leveys, varikartta_korkeus);

		let varikartta_alue_varitys_valkoinen =
			varikartta_alue.createLinearGradient(0, 0, leveys, 0);
		varikartta_alue_varitys_valkoinen.addColorStop(0, "rgba(255,255,255,1)");
		varikartta_alue_varitys_valkoinen.addColorStop(1, "rgba(255,255,255,0)");
		varikartta_alue.fillStyle = varikartta_alue_varitys_valkoinen;
		varikartta_alue.fillRect(0, 0, leveys, varikartta_korkeus);

		let varikartta_alue_varitys_musta = varikartta_alue.createLinearGradient(
			0,
			0,
			0,
			varikartta_korkeus
		);
		varikartta_alue_varitys_musta.addColorStop(0, "rgba(0,0,0,0)");
		varikartta_alue_varitys_musta.addColorStop(1, "rgba(0,0,0,1)");
		varikartta_alue.fillStyle = varikartta_alue_varitys_musta;
		varikartta_alue.fillRect(0, 0, leveys, varikartta_korkeus);

		let varivalinta = $(this).data("kohde");
		varivalinta.css(
			"background-color",
			"rgba(" +
				varitiedot[0] +
				"," +
				varitiedot[1] +
				"," +
				varitiedot[2] +
				",1)"
		);
		let hex = "";
		let hex_r = varitiedot[0].toString(16);
		let hex_g = varitiedot[1].toString(16);
		let hex_b = varitiedot[2].toString(16);
		if (hex_r < 16) {
			hex_r += "0";
		}
		if (hex_g < 16) {
			hex_g += "0";
		}
		if (hex_b < 16) {
			hex_b += "0";
		}
		hex = "#" + hex_r + hex_g + hex_b;
		varivalinta.data("vari", hex.toUpperCase());
	});

	$(".varikaista").mousemove(function (hiiritapahtuma) {
		if (hiiritapahtuma.buttons == 1) {
			let indikaattori = $(this).siblings(".varikaista_indikaattori");
			indikaattori.css({
				left: hiiritapahtuma.offsetX - indikaattori.outerWidth() / 2 + "px",
			});

			let leveys = $(this).closest(".varikehys").width();
			let varikartta_korkeus = $(this)
				.closest(".varikehys")
				.find(".varikarttakehys")
				.height();
			let varikartta = $(this).closest(".varikehys").find(".varikartta")[0];
			let varikartta_alue = varikartta.getContext("2d");
			let varikaista_alue = $(this)[0].getContext("2d");

			let varitiedot = varikaista_alue.getImageData(
				hiiritapahtuma.offsetX,
				hiiritapahtuma.offsetY,
				1,
				1
			).data;
			varikartta_alue.fillStyle =
				"rgba(" +
				varitiedot[0] +
				"," +
				varitiedot[1] +
				"," +
				varitiedot[2] +
				",1)";
			varikartta_alue.fillRect(0, 0, leveys, varikartta_korkeus);

			let varikartta_alue_varitys_valkoinen =
				varikartta_alue.createLinearGradient(0, 0, leveys, 0);
			varikartta_alue_varitys_valkoinen.addColorStop(0, "rgba(255,255,255,1)");
			varikartta_alue_varitys_valkoinen.addColorStop(1, "rgba(255,255,255,0)");
			varikartta_alue.fillStyle = varikartta_alue_varitys_valkoinen;
			varikartta_alue.fillRect(0, 0, leveys, varikartta_korkeus);

			let varikartta_alue_varitys_musta = varikartta_alue.createLinearGradient(
				0,
				0,
				0,
				varikartta_korkeus
			);
			varikartta_alue_varitys_musta.addColorStop(0, "rgba(0,0,0,0)");
			varikartta_alue_varitys_musta.addColorStop(1, "rgba(0,0,0,1)");
			varikartta_alue.fillStyle = varikartta_alue_varitys_musta;
			varikartta_alue.fillRect(0, 0, leveys, varikartta_korkeus);

			let varivalinta = $(this).data("kohde");
			varivalinta.css(
				"background-color",
				"rgba(" +
					varitiedot[0] +
					"," +
					varitiedot[1] +
					"," +
					varitiedot[2] +
					",1)"
			);
			let hex = "";
			let hex_r = varitiedot[0].toString(16);
			let hex_g = varitiedot[1].toString(16);
			let hex_b = varitiedot[2].toString(16);
			if (hex_r < 16) {
				hex_r += "0";
			}
			if (hex_g < 16) {
				hex_g += "0";
			}
			if (hex_b < 16) {
				hex_b += "0";
			}
			hex = "#" + hex_r + hex_g + hex_b;
			varivalinta.data("vari", hex.toUpperCase());
		}
	});

	let varikaista_indikaattori = $(".varikaista_indikaattori");

	varikaista_indikaattori.click(function (painiketapahtuma) {
		painiketapahtuma.stopPropagation();
	});

	if (!$(".varikehys").hasClass("piilotettu")) {
		$(".varikehys").addClass("piilotettu");
	}

	$(document).click(function (painiketapahtuma) {
		if (!$(".varikehys").hasClass("piilotettu")) {
			$(".varikehys").addClass("piilotettu");
		}
	});

	$(this).click(function (painiketapahtuma) {
		painiketapahtuma.stopPropagation();
		let varikehys = $(".varikehys");

		varikehys.css({
			top: $(this).offset().top + $(this).outerHeight(),
			left: $(this).offset().left,
		});
		varikehys.css(
			{ "border-top": "0px solid #000000" },
			{ "border-bottom": "2px solid #000000" }
		);

		if (varikehys.hasClass("piilotettu")) {
			varikehys.removeClass("piilotettu");

			$(".varikartta").data("kohde", $(this));
			$(".varikaista").data("kohde", $(this));

			let leveys = $(".varikehys").width();
			let varikartta_korkeus = $(".varikarttakehys").height();
			let varikartta = $(".varikartta")[0];
			let varikartta_alue = varikartta.getContext("2d");
			varikartta_alue.fillStyle = "rgba(0,0,0,1)";
			varikartta_alue.fillRect(0, 0, leveys, varikartta_korkeus);

			let varikartta_alue_varitys_valkoinen =
				varikartta_alue.createLinearGradient(0, 0, leveys, 0);
			varikartta_alue_varitys_valkoinen.addColorStop(0, "rgba(255,255,255,1)");
			varikartta_alue_varitys_valkoinen.addColorStop(1, "rgba(255,255,255,0)");
			varikartta_alue.fillStyle = varikartta_alue_varitys_valkoinen;
			varikartta_alue.fillRect(0, 0, leveys, varikartta_korkeus);

			let varikartta_alue_varitys_musta = varikartta_alue.createLinearGradient(
				0,
				0,
				0,
				varikartta_korkeus
			);
			varikartta_alue_varitys_musta.addColorStop(0, "rgba(0,0,0,0)");
			varikartta_alue_varitys_musta.addColorStop(1, "rgba(0,0,0,1)");
			varikartta_alue.fillStyle = varikartta_alue_varitys_musta;
			varikartta_alue.fillRect(0, 0, leveys, varikartta_korkeus);

			let rgb = $(this)
				.css("background-color")
				.replace("rgb(", "")
				.replace(")", "")
				.split(",");
			let r = rgb[0] / 255; //Red
			let g = rgb[1] / 255; //Green
			let b = rgb[2] / 255; //Blue
			let h = 0; //Hue
			let s = 0; //Saturation
			let v = 0; //Value
			let min = Math.min(r, g, b);
			let max = Math.max(r, g, b);
			let delta = max - min;
			if (delta > 0) {
				if (max == r) {
					h = (g - b) / delta;
				}
				if (max == g) {
					h = 2 + (b - r) / delta;
				}
				if (max == b) {
					h = 4 + (r - g) / delta;
				}
				if (delta) {
					s = delta / max;
				}
			}

			h = 60 * h;
			if (h < 0) {
				h += 360;
			}
			h = Math.floor(h);
			s = Math.floor(s * 100);
			v = Math.floor(max * 100);
			let varikaista_indikaattori_x = (h * $(".varikaista").width()) / 360;
			$(".varikaista_indikaattori").css({
				left:
					varikaista_indikaattori_x -
					$(".varikaista_indikaattori").outerWidth() / 2 +
					"px",
			});

			let varikartta_indikaattori_x = (s * $(".varikartta").width()) / 100;
			let varikartta_indikaattori_y =
				$(".varikartta").height() - (v * $(".varikartta").height()) / 100;
			$(".varikartta_indikaattori").css({
				top:
					varikartta_indikaattori_y -
					$(".varikartta_indikaattori").outerHeight() / 2 +
					"px",
				left:
					varikartta_indikaattori_x -
					$(".varikartta_indikaattori").outerWidth() / 2 +
					"px",
			});

			varikartta_alue.fillStyle =
				"rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",1)";
			varikartta_alue.fillRect(0, 0, leveys, varikartta_korkeus);

			varikartta_alue.fillStyle = varikartta_alue_varitys_valkoinen;
			varikartta_alue.fillRect(0, 0, leveys, varikartta_korkeus);

			varikartta_alue.fillStyle = varikartta_alue_varitys_musta;
			varikartta_alue.fillRect(0, 0, leveys, varikartta_korkeus);
		} else {
			varikehys.addClass("piilotettu");
		}
	});
};
