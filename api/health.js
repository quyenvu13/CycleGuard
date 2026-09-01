export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    project: 'CycleGuard',
    network: 'GenLayer StudioNet',
    contract: '0xFaCB1C2F37C33137C359a5efd66Eb3E21Cf7e123',
  })
}
