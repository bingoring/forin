import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Badge,
  Button,
  Card,
  CoinChip,
  Divider,
  Hearts,
  Icon,
  type IconName,
  ProgressBar,
  Pushable,
  SectionHeader,
  TextInput,
  Toggle,
  XPBar,
} from '../../ui';
import { color, sp, text } from '../../theme';

// Not wired into the main navigator — developers reach it via the
// Profile → (hidden) link or by pushing to this route from the dev
// shell. Purpose: render every DS primitive in every meaningful state
// so we can eyeball regressions after a theme change.

const ICON_NAMES: IconName[] = [
  'heart', 'flame', 'gem', 'star', 'lock', 'check', 'x',
  'play', 'mic', 'volume', 'chat', 'home', 'book', 'shop',
  'person', 'trophy', 'settings', 'arrow-left', 'arrow-right',
  'plus', 'coin',
];

export function DesignPlaygroundScreen() {
  const [pressCount, setPressCount] = useState(0);
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('nurse@hospital.org');
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={text.display}>Design playground</Text>
      <Text style={[text.caption, styles.lede]}>
        Every UI primitive, every variant. Use this to spot regressions
        after touching tokens or the Pushable math.
      </Text>

      <Section title="Buttons">
        <Row>
          <Button onPress={() => setPressCount((c) => c + 1)}>Primary</Button>
          <Button variant="coral" onPress={() => {}}>Coral</Button>
          <Button variant="success" onPress={() => {}}>Success</Button>
        </Row>
        <Row>
          <Button variant="danger" onPress={() => {}}>Danger</Button>
          <Button variant="premium" onPress={() => {}}>Premium</Button>
          <Button variant="dark" onPress={() => {}}>Dark</Button>
        </Row>
        <Row>
          <Button variant="secondary" onPress={() => {}}>Secondary</Button>
          <Button variant="ghost" onPress={() => {}}>Ghost</Button>
          <Button disabled onPress={() => {}}>Disabled</Button>
        </Row>
        <Row>
          <Button size="sm" onPress={() => {}}>SM</Button>
          <Button size="md" onPress={() => {}}>MD</Button>
          <Button size="lg" onPress={() => {}}>LG</Button>
          <Button size="xl" onPress={() => {}}>XL</Button>
        </Row>
        <Button full loading onPress={() => {}}>Loading…</Button>
        <Text style={text.caption}>Press count: {pressCount}</Text>
      </Section>

      <Section title="Icons">
        <View style={styles.iconGrid}>
          {ICON_NAMES.map((n) => (
            <View key={n} style={styles.iconCell}>
              <Icon name={n} size={24} color={color.primary} />
              <Text style={styles.iconLabel}>{n}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Cards">
        <Card>
          <Text style={text.h3}>Paper</Text>
          <Text style={text.caption}>Default surface for grouped content.</Text>
        </Card>
        <Card variant="sky">
          <Text style={text.h3}>Sky</Text>
          <Text style={text.caption}>Active / learning highlight.</Text>
        </Card>
        <Card variant="coral">
          <Text style={text.h3}>Coral</Text>
          <Text style={text.caption}>Accent tint.</Text>
        </Card>
        <Card variant="mint">
          <Text style={text.h3}>Mint</Text>
          <Text style={text.caption}>Success tint.</Text>
        </Card>
        <Card variant="sun">
          <Text style={text.h3}>Sun</Text>
          <Text style={text.caption}>XP tint.</Text>
        </Card>
        <Card variant="premium">
          <Text style={text.h3}>Premium</Text>
          <Text style={text.caption}>Lavender premium tint.</Text>
        </Card>
        <Card variant="ink">
          <Text style={[text.h3, styles.inkText]}>Ink</Text>
          <Text style={[text.caption, styles.inkTextSoft]}>Heavy emphasis / dark mode.</Text>
        </Card>
        <Card variant="cream">
          <Text style={text.h3}>Cream</Text>
          <Text style={text.caption}>Cozy surface — profile, shop, room.</Text>
        </Card>
      </Section>

      <Section title="Badges">
        <Row>
          <Badge>Neutral</Badge>
          <Badge tone="sky">Sky</Badge>
          <Badge tone="coral">Coral</Badge>
          <Badge tone="mint">Success</Badge>
        </Row>
        <Row>
          <Badge tone="sun">XP</Badge>
          <Badge tone="rose">Danger</Badge>
          <Badge tone="lav">Premium</Badge>
          <Badge tone="ink">Ink</Badge>
        </Row>
      </Section>

      <Section title="Progress">
        <ProgressBar label="Daily goal" value={65} />
        <ProgressBar label="Level XP" value={120} max={200} color={color.xp} />
        <ProgressBar label="Mastery" value={90} max={100} color={color.primary} showValue={false} />
        <XPBar segments={5} filled={3} />
      </Section>

      <Section title="Hearts / CoinChips">
        <Hearts total={5} filled={3} />
        <Row>
          <CoinChip amount={248} tone="gold" />
          <CoinChip amount={12} tone="gem" />
          <CoinChip amount={5} tone="heart" />
        </Row>
      </Section>

      <Section title="Inputs">
        <TextInput
          label="Email"
          placeholder="you@hospital.org"
          iconLeft="chat"
          value={text1}
          onChangeText={setText1}
          hint="We never share it."
        />
        <TextInput
          label="Password"
          placeholder="••••••••"
          value={text2}
          onChangeText={setText2}
          secureTextEntry
          error="Must be at least 8 characters"
        />
      </Section>

      <Section title="Toggle">
        <Row>
          <Toggle value={toggle1} onChange={setToggle1} />
          <Text style={text.body}>Push reminders</Text>
        </Row>
        <Row>
          <Toggle value={toggle2} onChange={setToggle2} color={color.accent} />
          <Text style={text.body}>Weekly digest (coral tint)</Text>
        </Row>
        <Row>
          <Toggle value={true} onChange={() => {}} disabled />
          <Text style={text.body}>Disabled (locked on)</Text>
        </Row>
      </Section>

      <Section title="Section headers & dividers">
        <SectionHeader
          eyebrow="Today"
          title="Daily quests"
          action={<Badge tone="sun">3 open</Badge>}
        />
        <Divider />
        <SectionHeader title="No eyebrow" />
        <Divider label="or" />
      </Section>

      <Section title="Pushable (raw)">
        <Pushable size="md" shadowColor={color.primaryDeep} onPress={() => {}}>
          <View style={styles.rawPush}>
            <Text style={[text.button, styles.rawPushText]}>Custom face</Text>
          </View>
        </Pushable>
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={[text.h2, styles.sectionTitle]}>{title}</Text>
      <View style={{ gap: sp.s3 }}>{children}</View>
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.cream },
  content: { padding: sp.s5, paddingBottom: sp.s10, gap: sp.s5 },
  lede: { marginBottom: sp.s3 },
  section: { gap: sp.s3 },
  sectionTitle: { marginBottom: sp.s2 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.s2, alignItems: 'center' },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.s2 },
  iconCell: {
    width: 72,
    paddingVertical: sp.s2,
    alignItems: 'center',
    backgroundColor: color.paper,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.hair,
  },
  iconLabel: { fontSize: 10, color: color.inkSoft, marginTop: 4 },
  inkText: { color: color.paper },
  inkTextSoft: { color: color.hairDark },
  rawPush: {
    paddingVertical: sp.s3,
    paddingHorizontal: sp.s5,
    backgroundColor: color.accent,
    borderRadius: 14,
  },
  rawPushText: { color: color.paper, fontSize: 15 },
});
