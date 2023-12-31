import Enumerable from 'linq';
import type { AnimeBadge } from '../AnimeBadge';
import { badgeIconText, hadWatchedAnime } from '../utils';
import ANIME_GENRES from '@/generated/animeGenres';
import redRaceVehicle from '../icons/redRaceVehicle';
import holyHalo from '../icons/holyHalo';
import bluePanties from '../icons/bluePanties';
import peachEmoji from '../icons/peachEmoji';
import samuraiHelmet from '../icons/samuraiHelmet';
import kameHameHa from '../icons/kameHameHa';
import militaryHelmet from '../icons/militaryHelmet';
import lightStick from '../icons/lightStick';

const genresBadges = [
	{
		id: 'casual_enjoyer_badge',
		name: 'Casual Enjoyer',
		description: 'Watched over 30 anime',
		icon: badgeIconText('🍥'),
		canHaveBadge: (animeList) => animeList.filter(hadWatchedAnime).length >= 30
	},
	{
		id: 'otaku_badge',
		name: 'Otaku',
		description: 'Watched over 300 anime',
		styles: {
			border: '2px solid #3e0070'
		},
		icon: badgeIconText('🍙'),
		canHaveBadge: (animeList) => animeList.filter(hadWatchedAnime).length >= 300
	},
	{
		id: 'weeb_badge',
		name: 'Weeb',
		description: 'Watched over 1000 anime',
		styles: {
			border: '2px solid #a80000'
		},
		icon: badgeIconText('🍣'),
		canHaveBadge: (animeList) => animeList.filter(hadWatchedAnime).length >= 1000
	},
	{
		id: 'god_and_anime_badge',
		name: /*html*/ `<span class="font-semibold">I have the power of god and anime</span>`,
		description: 'Watched over 4000 anime',
		icon: holyHalo,
		styles: {
			background: 'linear-gradient(142deg, rgba(255,255,255,1) 0%, rgba(255,250,192,1) 59%)',
			border: '2px solid #fcf05a',
			color: '#9c3100'
		},
		canHaveBadge: (animeList) => animeList.filter(hadWatchedAnime).length >= 4000
	},
	{
		id: 'it_is_funny_badge',
		name: 'It is funny',
		description: 'Watched 10 or more comedy anime',
		icon: badgeIconText('😂'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Comedy.ID))
					.count() >= 10
			);
		}
	},
	{
		id: 'anime_jester_badge',
		name: 'Anime Jester',
		description: 'Watched 50 or more comedy anime',
		icon: badgeIconText('🃏'),
		styles: {
			border: '2px solid #5fff4a'
		},
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Comedy.ID))
					.count() >= 50
			);
		}
	},
	{
		id: 'background_explosion_badge',
		name: '* Background Explosion *',
		description: 'Watched 10 or more action-packed anime',
		icon: badgeIconText('💥'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Action.ID))
					.count() >= 10
			);
		}
	},
	{
		id: 'where_is_the_guild_badge',
		name: 'Where is the guild?',
		description: 'Watched 50 or more Adventure anime',
		icon: badgeIconText('🗺️'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Adventure.ID)
					)
					.count() >= 50
			);
		}
	},
	{
		id: 'am_i_in_love_badge',
		name: 'Am I in love?',
		description: 'Watched 10 or more Romance anime',
		icon: badgeIconText('❤️'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Romance.ID))
					.count() >= 10
			);
		}
	},
	{
		id: 'twelve_episodes_to_kiss_badge',
		name: '12 episodes to kiss',
		description: 'Watched 50 or more Romance anime',
		styles: {
			border: '2px solid magenta'
		},
		icon: badgeIconText('💋'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Romance.ID))
					.count() >= 50
			);
		}
	},
	{
		id: 'lets_enter_the_dungeon_badge',
		name: "Let's enter the Dungeon",
		description: 'Watched 50 or more Fantasy anime',
		icon: badgeIconText('🗡️'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Fantasy.ID))
					.count() >= 50
			);
		}
	},
	{
		id: 'truck_kun_badge',
		name: 'Truck-kun?',
		description: 'Watched 10 or more Isekai or Reincarnation anime',
		icon: badgeIconText('🚛'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => {
							return (
								genre.id === ANIME_GENRES.Isekai.ID || genre.id === ANIME_GENRES.Reincarnation.ID
							);
						})
					)
					.count() >= 10
			);
		}
	},
	{
		id: 'why_is_he_so_op_badge',
		name: 'Why is he so OP?',
		description: 'Watched 50 or more Isekai or Reincarnation anime',
		icon: badgeIconText('⚔️'),
		styles: {
			border: '2px solid #00c7f9'
		},
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => {
							return (
								genre.id === ANIME_GENRES.Isekai.ID || genre.id === ANIME_GENRES.Reincarnation.ID
							);
						})
					)
					.count() >= 50
			);
		}
	},
	{
		id: 'deja_vu_badge',
		name: "I've been in this place before",
		description: 'Watched 10 or more Racing anime',
		icon: redRaceVehicle,
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Racing.ID))
					.count() >= 50
			);
		}
	},
	{
		id: 'the_eccentric_storyteller_badge',
		name: 'The Eccentric Storyteller',
		description: 'Watched 10 or more Avant Garde anime',
		icon: badgeIconText('➿'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.AvantGarde.ID)
					)
					.count() >= 50
			);
		}
	},
	{
		id: 'cant_wait_the_next_episode_badge',
		name: "Can't wait the next episode",
		description: 'Watched 30 or more Mystery anime',
		icon: badgeIconText('🌌'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Mystery.ID))
					.count() >= 30
			);
		}
	},
	{
		id: 'overly_dramatic_badge',
		name: 'Overly dramatic',
		description: 'Watched 20 or more Drama anime',
		icon: badgeIconText('🌒'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Drama.ID))
					.count() >= 20
			);
		}
	},
	{
		id: 'dont_open_the_door_badge',
		name: "Don't open the door",
		description: 'Watched 30 or more Ecchi anime',
		icon: bluePanties,
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Ecchi.ID))
					.count() >= 30
			);
		}
	},
	{
		id: 'your_turn_badge',
		name: 'Your Turn.',
		description: 'Watched 20 or more Strategy Game anime',
		styles: { px: 5 },
		icon: badgeIconText('♟️'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.StrategyGame.ID)
					)
					.count() >= 20
			);
		}
	},
	{
		id: 'homework_folder_badge',
		name: '* Homework Folder *',
		description: 'Watched 10 or more Hentai anime',
		icon: badgeIconText('📁'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Hentai.ID))
					.count() >= 10
			);
		}
	},
	{
		id: 'degenerate_badge',
		name: /*html*/ `<span class="font-semibold">Degenerate</span>`,
		description: 'Watched 69 or more Hentai anime',
		icon: peachEmoji,
		styles: {
			background: 'linear-gradient(142deg, rgba(255,249,237,1) 0%, rgba(255,220,205,1) 59%)',
			color: '#ff4646'
		},
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Hentai.ID))
					.count() >= 69
			);
		}
	},
	{
		id: 'vintage_badge',
		name: 'Vintage',
		description: 'Watched 35 or more Historical anime',
		icon: badgeIconText('👘'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Historical.ID)
					)
					.count() >= 35
			);
		}
	},
	{
		id: 'scawry_badge',
		name: 'Scawry',
		description: 'Watched 20 or more Horror anime',
		icon: badgeIconText('👻'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Horror.ID))
					.count() >= 20
			);
		}
	},
	{
		id: 'good_ol_days_badge',
		name: "Good ol' days",
		description: 'Watched 20 or more Kids anime',
		icon: badgeIconText('🍭'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Kids.ID))
					.count() >= 20
			);
		}
	},
	{
		id: 'lets_fight_badge',
		name: "Let's fight!",
		description: 'Watched 20 or more Martial Arts anime',
		icon: badgeIconText('🥋'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.MartialArts.ID)
					)
					.count() >= 20
			);
		}
	},
	{
		id: 'dont_destroy_the_city_badge',
		name: "Don't destroy the city",
		description: 'Watched 40 or more Mecha anime',
		icon: badgeIconText('🤖'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Mecha.ID))
					.count() >= 40
			);
		}
	},
	{
		id: 'bring_your_instrument_badge',
		name: 'Bring your instrument',
		description: 'Watched 10 or more Music anime',
		icon: badgeIconText('🎻'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Music.ID))
					.count() >= 10
			);
		}
	},
	{
		id: 'wait_what_instrument_badge',
		name: 'Wait, what?',
		description: 'Watched 22 or more Parody anime',
		icon: badgeIconText('❓'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Parody.ID))
					.count() >= 22
			);
		}
	},
	{
		id: 'sheath_sword_badge',
		name: '* Sheath Sword *',
		description: 'Watched 30 or more Samurai anime',
		icon: samuraiHelmet,
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Samurai.ID))
					.count() >= 30
			);
		}
	},
	{
		id: 'back_to_school_badge',
		name: 'Back to School',
		description: 'Watched 30 or more School anime',
		icon: badgeIconText('✍️'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.School.ID))
					.count() >= 30
			);
		}
	},
	{
		id: 'waiting_my_charming_prince_badge',
		name: 'Waiting my Charming Prince',
		description: 'Watched 30 or more Shoujo anime',
		icon: badgeIconText('🌸'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Shoujo.ID))
					.count() >= 30
			);
		}
	},
	{
		id: 'universe_is_massive_badge',
		name: 'Universe is massive',
		description: 'Watched 40 or more Space anime',
		icon: badgeIconText('🌠'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Space.ID))
					.count() >= 40
			);
		}
	},
	{
		id: 'sports_spectator_badge',
		name: 'Sports Spectator ',
		description: 'Watched 40 or more Sports anime',
		icon: badgeIconText('🏀'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Sports.ID))
					.count() >= 40
			);
		}
	},
	{
		id: 'kame_hame_ha_badge',
		name: 'Kame Hame Ha!',
		description: 'Watched 100 or more SuperPower anime',
		icon: kameHameHa,
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.SuperPower.ID)
					)
					.count() >= 100
			);
		}
	},
	{
		id: 'take_care_of_your_neck_badge',
		name: 'Take Care of Your Neck',
		description: 'Watched 20 or more Vampire anime',
		icon: badgeIconText('🍷'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Vampire.ID))
					.count() >= 20
			);
		}
	},
	{
		id: 'whats_your_girl_badge',
		name: "What's your girl?",
		description: 'Watched 30 or more Harem anime',
		icon: badgeIconText('💕'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Harem.ID))
					.count() >= 30
			);
		}
	},
	{
		id: 'summer_festival_badge',
		name: 'Summer Festival',
		description: 'Watched 40 or more Slice Of Life anime',
		icon: badgeIconText('🍡'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.SliceofLife.ID)
					)
					.count() >= 40
			);
		}
	},
	{
		id: 'beach_episode_badge',
		name: 'Beach Episode',
		description: 'Watched 100 or more Slice Of Life anime',
		icon: badgeIconText('👙'),
		styles: {
			border: '2px solid #ff1c64'
		},
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.SliceofLife.ID)
					)
					.count() >= 100
			);
		}
	},
	{
		id: 'that_felt_paranormal_badge',
		name: 'That felt paranormal',
		description: 'Watched 30 or more Supernatural anime',
		icon: badgeIconText('🔮'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Supernatural.ID)
					)
					.count() >= 30
			);
		}
	},
	{
		id: 'yes_sir_badge',
		name: 'Yes Sir',
		description: 'Watched 20 or more Military anime',
		icon: militaryHelmet,
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Military.ID)
					)
					.count() >= 20
			);
		}
	},
	{
		id: 'close_to_solve_the_case_badge',
		name: 'Close to solve the case',
		description: 'Watched 20 or more Detective anime',
		icon: badgeIconText('🔎'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Detective.ID)
					)
					.count() >= 20
			);
		}
	},
	{
		id: 'get_out_my_head_badge',
		name: 'Get out my head',
		description: 'Watched 30 or more Psychological anime',
		icon: badgeIconText('⛓️'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Psychological.ID)
					)
					.count() >= 30
			);
		}
	},
	{
		id: 'too_intrigued_badge',
		name: 'Too Intrigued',
		description: 'Watched 20 or more Suspense anime',
		icon: badgeIconText('🕔'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Suspense.ID)
					)
					.count() >= 20
			);
		}
	},
	{
		id: 'that_is_so_deep_badge',
		name: 'That is so deep',
		description: 'Watched 40 or more Seinen anime',
		icon: badgeIconText('👤'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Seinen.ID))
					.count() >= 40
			);
		}
	},
	{
		id: 'i_am_an_adult_now_badge',
		name: "I'm an adult now",
		description: 'Watched 20 or more Josei anime',
		icon: badgeIconText('⌛'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Josei.ID))
					.count() >= 20
			);
		}
	},
	{
		id: 'oishii_badge',
		name: 'Oishii',
		description: 'Watched 10 or more Gourmet anime',
		icon: badgeIconText('🍜'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Gourmet.ID))
					.count() >= 10
			);
		}
	},
	{
		id: 'furry_badge',
		name: 'Furry?',
		description: 'Watched 30 or more Anthropomorphic anime',
		icon: badgeIconText('🐺'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Anthropomorphic.ID)
					)
					.count() >= 30
			);
		}
	},
	{
		id: 'where_all_that_blood_come_from_badge',
		name: 'Where all that blood come from?',
		description: 'Watched 15 or more Gore anime',
		icon: badgeIconText('🩸'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Gore.ID))
					.count() >= 15
			);
		}
	},
	{
		id: 'idol_fan_badge',
		name: 'Idol Fan',
		description: 'Watched 30 or more Idol anime',
		icon: lightStick,
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some(
							(genre) =>
								genre.id === ANIME_GENRES.IdolsMale.ID || genre.id === ANIME_GENRES.IdolsFemale.ID
						)
					)
					.count() >= 30
			);
		}
	},
	{
		id: 'is_this_a_kids_show_right_badge',
		name: "It's this a kids show, right?",
		description: 'Watched 25 or more Mahou Shoujo anime',
		icon: badgeIconText('💗'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.MahouShoujo.ID)
					)
					.count() >= 25
			);
		}
	},
	{
		id: 'eh_actually_badge',
		name: 'Eh, actually...',
		description: 'Watched 30 or more Otaku Culture anime',
		icon: badgeIconText('🏯'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.OtakuCulture.ID)
					)
					.count() >= 30
			);
		}
	},
	{
		id: 'kawaii_badge',
		name: 'Kawaii',
		description: 'Watched 10 or more Pets anime',
		icon: badgeIconText('🐼'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) => (x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.Pets.ID))
					.count() >= 10
			);
		}
	},
	{
		id: 'there_are_so_handsome_badge',
		name: 'They are so handsome!',
		description: 'Watched 10 or more Reverse Harem anime',
		icon: badgeIconText('🫦'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.ReverseHarem.ID)
					)
					.count() >= 10
			);
		}
	},
	{
		id: 'my_hp_is_so_low_badge',
		name: 'My HP is so low',
		description: 'Watched 20 or more Reverse VideoGame anime',
		icon: badgeIconText('🕹️'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.VideoGame.ID)
					)
					.count() >= 20
			);
		}
	},
	{
		id: 'are_you_john_titor_badge',
		name: 'Are you John Titor?',
		description: 'Watched 20 or more Time Travel anime',
		icon: badgeIconText('🕰️'),
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.TimeTravel.ID)
					)
					.count() >= 20
			);
		}
	},
	{
		id: 'good_taste_badge',
		name: /*html*/ `<b class="text-amber-900">Good Taste</b>`,
		description: 'Watched 30 or more award winning anime',
		icon: badgeIconText('🪙'),
		styles: {
			border: '2px solid #d69200',
			background: 'linear-gradient(205deg, rgba(173,90,0,1) 45%, rgba(255,231,0,1) 100%)',
			color: 'black'
		},
		canHaveBadge: (animeList) => {
			return (
				Enumerable.from(animeList)
					.where((x) => hadWatchedAnime(x))
					.where((x) =>
						(x.node.genres || []).some((genre) => genre.id === ANIME_GENRES.AwardWinning.ID)
					)
					.count() >= 30
			);
		}
	},
	{
		id: 'trash_taste_badge',
		name: /*html*/ `<b class="text-violet-300">Trash Taste</b>`,
		description: 'Give good scores to 10 of the worst scored anime',
		icon: (size) => {
			return /*html*/ `
            <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
                <path fill="#f5d0fe" d="M7 21q-.825 0-1.413-.588T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.588 1.413T17 21H7Zm2-4h2V8H9v9Zm4 0h2V8h-2v9Z"/>
            </svg>`;
		},
		styles: {
			border: '2px solid #6b21a8',
			background: 'linear-gradient(205deg, #3b0764 45%, #000 100%)',
			color: 'black'
		},
		canHaveBadge: (animeList) => {
			const GOOD_SCORE = 7;
			const BAD_SCORE = 4;
			const total = Enumerable.from(animeList)
				.where((anime) => anime.node.mean <= BAD_SCORE && anime.list_status.score >= GOOD_SCORE)
				.count();
			return total >= 10;
		}
	}
] as AnimeBadge[];

export default genresBadges;
