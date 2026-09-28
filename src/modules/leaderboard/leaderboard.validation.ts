import Z from 'zod';


const leaderboardSchema = Z.object({

    timer:Z.number(),
    score:Z.number()

})

const leaderboardSchemaUpdate = Z.object({
    timer:Z.number(),
    score:Z.number()
})

export type leaderBoardCreate = Z.infer<typeof leaderboardSchema>
export type updateLeaderBoard = Z.infer<typeof leaderboardSchemaUpdate>