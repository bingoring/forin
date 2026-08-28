// Edit the name other people see.
//
// There was no name at all: colleague rows called people by the first six characters
// of their user id, so a linked colleague read as "A3F2B1" and nobody could tell who
// anybody was. This is where the learner fixes that for themselves.
//
// Three things are deliberate:
//
//  1. The saved value comes back from the SERVER and is what gets applied, not what
//     was typed. The server collapses whitespace, so echoing the input would leave
//     this screen showing a name that differs from the one a colleague sees.
//  2. Clearing is allowed. An empty field saves as "cleared" and the short id comes
//     back — taking your name off is a thing people want to be able to do, and it is
//     also the only way out of a name typed by mistake.
//  3. The limit is counted in the same unit the server counts in: runes. A byte
//     counter would tell a Korean learner they had used 15 of 20 characters after
//     typing five.
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { api } from '@/api/client';
import { BottomSheet } from '@/components/BottomSheet';
import { PixelButton } from '@/components/PixelButton';
import { colors, fonts, fs } from '@/theme/tokens';
import { useT } from '@/i18n';

/** Mirrors the server's user.MaxDisplayNameLen. Duplicated on purpose — the input has
 *  to stop somewhere before a round trip — and the server remains the authority: a
 *  longer name reaching it is rejected, not truncated. */
export const MAX_NAME_LEN = 20;

/** Rune count, matching the server's utf8.RuneCountInString. [...s] splits on code
 *  points, so "김민아" counts as 3 where s.length would say 3 as well but an emoji
 *  would say 2. */
export const nameLength = (s: string): number => [...s].length;

export function NameSheet({ visible, current, onClose, onSaved }: {
  visible: boolean;
  /** The name in force, or '' when none is set. */
  current: string;
  onClose: () => void;
  /** Called with the SERVER's version of the saved name. */
  onSaved: (name: string) => void;
}) {
  const t = useT();
  const [value, setValue] = useState(current);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  // Re-seeded on each open: a sheet reopened after a cancel must show the name in
  // force, not the abandoned edit.
  useEffect(() => {
    if (visible) { setValue(current); setFailed(false); setSaving(false); }
  }, [visible, current]);

  const tooLong = nameLength(value) > MAX_NAME_LEN;
  const save = async () => {
    if (saving || tooLong) return;
    setSaving(true);
    setFailed(false);
    try {
      const saved = await api.setDisplayName(value);
      onSaved(saved);
      onClose();
    } catch {
      // Stays open with the text intact. Closing on failure would look like a save.
      setFailed(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      header={<Text style={styles.title}>{t('profile.nameSheetTitle')}</Text>}
    >
      <View style={styles.body}>
        <Text style={styles.why}>{t('profile.nameSheetWhy')}</Text>

        <View style={[styles.field, tooLong && styles.fieldBad]}>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder={t('profile.namePlaceholder')}
            placeholderTextColor={colors.textFaint}
            style={styles.input}
            autoFocus
            // One line, because it is drawn on one line everywhere it appears.
            multiline={false}
            returnKeyType="done"
            onSubmitEditing={save}
            maxLength={MAX_NAME_LEN * 4}
          />
        </View>

        <View style={styles.meta}>
          <Text style={[styles.count, tooLong && styles.countBad]}>
            {nameLength(value)} / {MAX_NAME_LEN}
          </Text>
          {!!failed && <Text style={styles.error}>{t('profile.nameSaveFailed')}</Text>}
        </View>

        {/* Says what an empty field will do, rather than leaving the learner to find
            out by saving. Only when the field IS empty and there is a name to lose. */}
        {value.trim() === '' && current !== '' && (
          <Text style={styles.hint}>{t('profile.nameClearHint')}</Text>
        )}

        <View style={styles.actions}>
          <View style={styles.action}>
            <PixelButton label={t('common.cancel')} bg="#fff" shadowColor={colors.ink} full onPress={onClose} />
          </View>
          <View style={styles.action}>
            {saving ? (
              <View style={styles.savingBox}><ActivityIndicator color={colors.ink} /></View>
            ) : (
              <PixelButton
                label={t('common.save')}
                bg={colors.yellow}
                shadowColor={colors.yellowShadow}
                disabled={tooLong}
                full
                onPress={save}
              />
            )}
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.heading, fontSize: fs(13), color: colors.ink },
  body: { paddingHorizontal: 16, paddingBottom: 18, gap: 10 },
  why: { fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, lineHeight: 16 },
  field: { borderWidth: 2.5, borderColor: colors.ink, backgroundColor: '#fff', paddingHorizontal: 10 },
  fieldBad: { borderColor: '#EF4444' },
  input: { fontFamily: fonts.body, fontSize: fs(14), color: colors.ink, paddingVertical: 10 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  count: { fontFamily: fonts.heading, fontSize: fs(9.5), color: colors.textSoft },
  countBad: { color: '#EF4444' },
  error: { flex: 1, fontFamily: fonts.body, fontSize: fs(10), color: '#EF4444' },
  hint: { fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, lineHeight: 15 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 2 },
  action: { flex: 1 },
  savingBox: {
    borderWidth: 2.5,
    borderColor: colors.ink,
    backgroundColor: colors.cream,
    paddingVertical: 9,
    alignItems: 'center',
  },
});
