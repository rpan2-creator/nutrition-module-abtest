/**
 * This study writes to its own tables, so it can share a Supabase project with the
 * earlier predict/told study without the two data sets ever mixing.
 */
export const T_PARTICIPANTS = "ab_participants";
export const T_EVENTS = "ab_events";
